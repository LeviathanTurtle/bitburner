/** @param {NS} ns */

// Several servers have 0 GB RAM available. This means that scripts cannot be run
// on those servers. Instead, they must be running on a separate server. This
// script purchases a new private server, uploads the main 3 attacking scripts,
// and executes them on said server attacking one of the 0 GB RAM servers. This is
// repeated until we cannot buy more private servers, or until there are no more
// servers to hack.

// DELETE SERVERS
/*
var currentServers = getPurchasedServers();

for (const serv of currentServers) {
    killall(serv);
    deleteServer(serv);
}
*/

export async function main(ns, ram) {
    ns.tail();

    // array of main files to copy and use
    const files = ["weaken-template.js", "hack-template.js", "grow-template.js"];

    // How much RAM each purchased server will have
    ram = ns.args.length > 0 ? ns.args[0] : 64;
    ram_req = files.reduce((total, file) => total + ns.getScriptRam(file), 0);

    // read contents of the server list file
    const fileContents = ns.read('servers-no-ram.txt');
    // split the file contents into lines
    const servers_no_ram = fileContents
        .split('\n') // split up each line
        .map(line => line.trim()) // remove any leading/trailing whitespace (\r)
        .filter(line => line.length > 0); // remove empty lines
    ns.printf("Servers: %s", servers);


    // Sort "servers_no_ram" from lowest hacking level to highest
    servers_no_ram.sort((a, b) => {
        // Get the required hacking level for each server
        const hackingLevelA = ns.getServerRequiredHackingLevel(a);
        const hackingLevelB = ns.getServerRequiredHackingLevel(b);

        // Return the difference to sort the array
        return hackingLevelA - hackingLevelB;
    });


    // server array index var
    let j = 0;
    // Continuously try to purchase servers until we've reached the maximum
    // amount of servers
    for(let i=0; i < ns.getPurchasedServerLimit(); ++i) {
        const serv = servers_no_ram[j];
        // bool to determine if the current server is hackable
        let hackable = true;

        // check for current hack level vs. server
        if (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(serv)) {
            ns.printf("Current server %s is not currently hackable\n", serv);
            hackable = false;
        }

        // if the prv server for this server already exists, restart
        if (ns.serverExists(`pserv-${i}-${serv}`)) {
            hackable = false;
            let prv_serv = `pserv-${i}-${serv}`;
            ns.printf("Private server for %s already exists. Resetting scripts", serv);

            ns.killall(prv_serv);
            // remove files
            ns.rm("weaken-template.js",prv_serv);
            ns.rm("hack-template.js",prv_serv);
            ns.rm("grow-template.js",prv_serv);
            // recopy files
            ns.scp(files,prv_serv);

            // check that we have root access
            if (!ns.hasRootAccess(serv)) {
              await access(ns,serv,ns.getServerNumPortsRequired(serv));
            }

            // execute scripts with max threads
            let threads = Math.floor((ns.getServerMaxRam(prv_serv) - ns.getServerUsedRam(prv_serv)) / ram_req);
            await execFiles(ns, files, prv_serv, serv, threads);

            ns.printf("All files successfully running on %s\n", serv);
        }

        // check that we have root access
        if (!ns.hasRootAccess(serv)) {
            await access(ns,serv,ns.getServerNumPortsRequired(serv));
        }

        // we can hack the server
        if (hackable) {
            // Check if we have enough money to purchase a server
            if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
                // 1. announce purchase, purchase server 
                ns.printf("Purchasing %d GB server to attack %s", ram, serv);
                await ns.sleep(1000);
                let hostname = ns.purchaseServer(`pserv-${i}-${serv}`, ram);

                // 2. copy files to new server
                ns.scp(files,hostname)

                // check that we have root access
                if (!ns.hasRootAccess(serv)) {
                  await access(ns,serv,ns.getServerNumPortsRequired(serv));
                }
                
                // 3. execute scripts with max threads
                let threads = Math.floor((ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname)) / ram_req);
                if (threads > 0) {
                    ns.printf("Launching scripts '%s' on %s with %d threads", files, hostname, threads);
                    await ns.sleep(1000);
                    await execFiles(ns, files, hostname, serv, threads);

                    ns.printf("All files successfully running on %s\n", hostname);
                } else {
                    ns.printf("Files not running on %s due to invalid thread count (%d)\n", hostname, threads);
                }
            }
        }

        // increment for next server
        j++;
        
        // Make the script wait for a second before looping again.
        // Removing this line will cause an infinite loop and crash the game.
        await ns.sleep(1000);
    }

    ns.print("DONE -- purchasing private servers to attack no-memory servers");
    return;
}



async function execFiles(ns, files, server, target, threads) {
    return new Promise(resolve => {
        const executeFile = async (fileIndex) => {
            if (fileIndex >= files.length) {
                resolve(true); // all files executed successfully
                return;
            }
            
            const file = files[fileIndex];
            // successful start
            if (ns.exec(file,server,threads,target)) {
                //ns.printf("File '%s' running on home", file);
                setTimeout(() => executeFile(fileIndex + 1), 500); // Execute next file after .5 second
            }
            // could not execute file
            else {
                //ns.printf("Failed to start file '%s' on home", file);
                setTimeout(() => executeFile(fileIndex), 1000); // Retry after 1 second
            }
        };

        executeFile(0); // start executing files from the beginning of the array
    });
}


async function access(ns, server, num_ports) {
    // map of required programs IN ORDER
    const exploits = {
        "BruteSSH.exe": ns.brutessh,
        "FTPCrack.exe": ns.ftpcrack,
        "RelaySMTP.exe": ns.relaysmtp,
        "HTTPWorm.exe": ns.httpworm,
        "SQLInject.exe": ns.sqlinject
    };

    // Convert keys to an ordered array
    const programs = Object.keys(exploits);

    // iterate over the programs up to the number of ports required
    for (let i=0; i < num_ports; i++) {
        const program = programs[i];

        // check if the required program exists
        if (!ns.fileExists(program, "home")) {
            ns.printf("Required program '%s' not found.", program);
            return false;
        }

        // execute the corresponding program
        if (exploits[program]) {
            ns.printf("%s-ing %s (%d ports)", program.replace(".exe", ""), server, num_ports);
            await ns.sleep(500);
            exploits[program](server);
        }
    }

    // 
    ns.printf("Nuking %s", server);
    await ns.sleep(500);
    ns.nuke(server);
    return true;
}
