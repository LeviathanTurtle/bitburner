/** @param {NS} ns */

// 5.75 GB total RAM across 3 scripts
// 16 GB : 2 threads each (4.5 free)
// 32 GB : 5 threads each (3.25 free)
// 64 GB : 11 threads each (.75 free)
// 128 GB : 22 threads each (1.5 free)
// 256 GB : 

export async function main(ns/*, affected_servers*/) {
    // array of main files to copy and use
    const files = ["weaken-template.js", "hack-template.js", "grow-template.js"];
    //ns.tprint(`TEST: ns.getHostName = ${ns.getHostname()}`);

    // read contents of the server list file
    const fileContents = ns.read('servers.txt');
    // split the file contents into lines
    const servers = fileContents
        .split('\n') // split up each line
        .map(line => line.trim()) // remove any leading/trailing whitespace (\r)
        .filter(line => line.length > 0); // remove empty lines
    //ns.tprint(servers);

    const newFileContents = ns.read('servers-no-ram.txt');
    const newServers = newFileContents
        .split('\n') // split up each line
        .map(line => line.trim()) // remove any leading/trailing whitespace (\r)
        .filter(line => line.length > 0); // remove empty lines
    // add to servers array
    servers.push(...newServers);
    //ns.tprint(servers);
    


    // calculate total script ram usage
    //let ram_req = 0;
    //for (let i=0; i < files.length; ++i) {
    //  ram_req += ns.getScriptRam(files[i]);
    //}
    let ram_req = files.reduce((total, file) => total + ns.getScriptRam(file), 0);
    //ns.tprint(`total script ram required: ${ram_req}\n\n`);
    
    // variable to see how many servers are affected
    //let affect_server_count = 0;

    let threads = Math.floor((ns.getServerMaxRam("home") - ns.getServerUsedRam("home") - 4) / ram_req / /*affected_*/servers.length);



    // Just run the scripts from home
    for (let i = 0; i < /*affected_*/servers.length; ++i) {
        const serv = /*affected_*/servers[i];
        // bool to determine if the current server is hackable
        let hackable = true;

        // announce this portion
        ns.tprint(`Next server: ${serv}. Beginning in 1s...`);
        await ns.sleep(1000);

        // check for current hack level vs. server
        if (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(serv)) {
          ns.tprint(`Current server ${serv} is not currently hackable\n\n`);
          hackable = false;
        }
        // filter out n00dles
        if (serv == "n00dles") {
          ns.tprint("Skipping n00dles.");
          hackable = false;
        } // move this to the array reading

        if (hackable && threads > 0) {
          if (!ns.hasRootAccess(serv)) {
            await access(ns,serv,ns.getServerNumPortsRequired(serv));
          }
          
          ns.tprint(`Launching scripts '${files}' on home with ${threads} threads in .5s...`);
          await ns.sleep(500);

          await execFiles(ns, files, serv, threads);

          ns.tprint("All files successfully running on home\n\n");
          //await ns.sleep(5000);
          //affect_server_count++;
        }
    }

    ns.tprint("DONE -- executing scripts on home");
    //ns.tprint(`Affected servers: ${affect_server_count}`);
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
            //if (ns.exec(file, "home", threads, ...target)) {
            if (ns.run(file,threads,target)) {
                ns.tprint(`File ${file} running on home`);
                setTimeout(() => executeFile(fileIndex + 1), 500); // Execute next file after .5 second
            }
            // could not execute file
            else {
                ns.tprint(`Failed to start file ${file} on home`);
                setTimeout(() => executeFile(fileIndex), 1000); // Retry current file after 1 second
            }
        };

        executeFile(0); // Start executing files from the beginning of the array
    });
}



async function access(ns, server, num_ports) {
    // array of required programs
    const programs = [
        "BruteSSH.exe",
        "FTPCrack.exe",
        "RelaySMTP.exe",
        "HTTPWorm.exe",
        "SQLInject.exe"
    ];

    // iterate over the programs up to the number of ports required
    for (let i = 0; i < num_ports; i++) {
        const program = programs[i];
        // check if the required program exists
        if (!ns.fileExists(program, "home")) {
            ns.tprint(`Required program ${program} not found.`);
            return false;
        }
        // execute the corresponding program
        switch (program) {
            case "BruteSSH.exe":
                ns.tprint(`BruteSSH-ing ${server} (${num_ports} ports) in .5s...`);
                await ns.sleep(500);
                ns.brutessh(server);
                break;

            case "FTPCrack.exe":
                ns.tprint(`FTPCrack-ing ${server} (${num_ports} ports) in .5s...`);
                await ns.sleep(500);
                ns.ftpcrack(server);
                break;

            case "RelaySMTP.exe":
                ns.tprint(`RelaySMTP-ing ${server} (${num_ports} ports) in .5s...`);
                await ns.sleep(500);
                ns.relaysmtp(server);
                break;

            case "HTTPWorm.exe":
                ns.tprint(`HTTPWorm-ing ${server} (${num_ports} ports) in .5s...`);
                await ns.sleep(500);
                ns.httpworm(server);
                break;

            case "SQLInject.exe":
                ns.tprint(`SQLInject-ing ${server} (${num_ports} ports) in .5s...`);
                await ns.sleep(500);
                ns.sqlinject(server);
                break;
        }
    }

    // 
    ns.tprint(`Nuking ${server} in 1s...`);
    await ns.sleep(500);
    ns.nuke(server);
    return true;
}
