/** @param {NS} ns */
export async function main(ns, ram) {
    ns.tail();

    // array of main files to copy and use
    const files = ["weaken-template.js", "hack-template.js", "grow-template.js"];

    // read contents of the server list file
    const fileContents = ns.read('servers-no-ram.txt');
    // split the file contents into lines
    const servers = fileContents
        .split('\n') // split up each line
        .map(line => line.trim()) // remove any leading/trailing whitespace (\r)
        .filter(line => line.length > 0); // remove empty lines
    ns.printf("Servers: %s", servers)

    // How much RAM each purchased server will have
    ram = ns.args.length > 0 ? ns.args[0] : 64;
    ram_req = files.reduce((total, file) => total + ns.getScriptRam(file), 0);


    for (let i=0; i<servers.length; ++i) {
        // Check if we have enough money to purchase a server
        if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
            // If we have enough money, then:
            //  1. Purchase the server
            //  2. Copy our hacking scripts onto the newly-purchased server
            //  3. Run our hacking scripts on the newly-purchased server

            let hostname = ns.purchaseServer("pserv-"+i, ram);

            ns.scp(files, hostname);

            // calculate max threads
            let threads = Math.floor((ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname)) / ram_req);
            await execFiles(ns, files, hostname, threads);
        }

        // Make the script wait for a second before looping again.
        // Removing this line will cause an infinite loop and crash the game.
        await ns.sleep(1000);
    }
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
            if (ns.exec(file,target,threads)) {
                //ns.printf("File '%s' running on home", file);
                setTimeout(() => executeFile(fileIndex + 1), 500); // Execute next file after .5 second
            }
            // could not execute file
            else {
                //ns.printf("Failed to start file '%s' on home", file);
                setTimeout(() => executeFile(fileIndex), 1000); // Retry after 1 second
            }
        };

        executeFile(0); // Start executing files from the beginning of the array
    });
}