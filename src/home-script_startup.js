/** @param {NS} ns */
export async function main(ns) {
    // array of main files to copy and use
    const files = ["weaken-template.js", "hack-template.js", "grow-template.js"];

    // --- GET LIST OF SERVERS ------------------
    // read contents of the server list file
    const fileContents = ns.read('servers.txt');

    // split the file contents into lines
    const servers = fileContents
        .split('\n') // split up each line
        .map(line => line.trim()) // remove any leading/trailing whitespace (\r)
        .filter(line => line.length > 0 && line !== "n00dles"); // remove empty lines and n00dles

    const newFileContents = ns.read('servers-no-ram.txt');
    const newServers = newFileContents
        .split('\n')
        .map(line => line.trim()) 
        .filter(line => line.length > 0);
    servers.push(...newServers); // append to other servers

    ns.printf("Servers: %s", servers)
    
    // --- CALCULATE MAX THREADS ----------------
    // calculate total script ram usage
    let ram_req = files.reduce((total, file) => total + ns.getScriptRam(file), 0);
    ns.printf("total script ram required: %d", ram_req);

    let threads = Math.floor((ns.getServerMaxRam("home") - ns.getServerUsedRam("home") - 4) / ram_req / servers.length);

    // --- RUN SCRIPTS FROM HOME ----------------
    for (let i=0; i < servers.length; ++i) {
        const serv = servers[i];

        // bool to determine if the current server is hackable
        let hackable = true;

        // announce this portion
        ns.printf("Next server: %s", serv);
        await ns.sleep(1000);

        // check for current hack level vs. server
        if (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(serv)) {
          hackable = false;
        }

        if (hackable && threads > 0) {
          // if we do not have root access, do so now
          if (!ns.hasRootAccess(serv)) {
            await access(ns,serv,ns.getServerNumPortsRequired(serv));
          }
          
          ns.printf("Launching scripts '%s' on home with %d threads", files, threads);
          await ns.sleep(500);

          await execFiles(ns, files, serv, threads);

          ns.print("All files successfully running on home");
          //await ns.sleep(5000);
        } else {
          ns.printf("Current server %s is not currently hackable or has too few threads", serv);
        }
    }

    ns.print("DONE -- executing scripts on home");
    return;
}



async function execFiles(ns, files, target, threads) {
    return new Promise(resolve => {
        const executeFile = async (fileIndex) => {
            if (fileIndex >= files.length) {
                resolve(true); // All files executed successfully
                return;
            }
            
            const file = files[fileIndex];
            // successful start
            if (ns.run(file,threads,target)) {
                ns.print("File '%s' running on home", file);
                setTimeout(() => executeFile(fileIndex + 1), 500); // Execute next file after .5 second
            }
            // could not execute file
            else {
                ns.print("Failed to start file '%s' on home", file);
                setTimeout(() => executeFile(fileIndex), 1000); // Retry current file after 1 second
            }
        };

        executeFile(0); // Start executing files from the beginning of the array
    });
}



async function access(ns, server, num_ports) {
    // map of required programs IN ORDER
    const programs = {
        "BruteSSH.exe": ns.brutessh,
        "FTPCrack.exe": ns.ftpcrack,
        "RelaySMTP.exe": ns.relaysmtp,
        "HTTPWorm.exe": ns.httpworm,
        "SQLInject.exe": ns.sqlinject
    };

    // iterate over the programs up to the number of ports required
    for (let i=0; i < num_ports; i++) {
        const program = programs[i];

        // check if the required program exists
        if (!ns.fileExists(program, "home")) {
            ns.print("Required program '%s' not found.", program);
            return false;
        }

        // execute the corresponding program
        if (exploits[program]) {
            ns.print("%s-ing %s (%d ports)", program.replace(".exe", ""), server, num_ports);
            await ns.sleep(500);
            exploits[program](server);
        }
    }

    // 
    ns.print("Nuking %s", server);
    await ns.sleep(500);
    ns.nuke(server);
    return true;
}
