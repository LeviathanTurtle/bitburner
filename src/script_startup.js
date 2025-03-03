/** @param {NS} ns */
export async function main(ns) {
    ns.tail();
    
    // array of main files to copy and use
    const files = ["weaken-template.js", "hack-template.js", "grow-template.js"];
  
    // --- GET LIST OF SERVERS -----------------------
    // array of servers affected
    let affected_servers = [];
    // variable to see how many servers are affected
    let affect_server_count = 0;
  
    // read contents of the server list file
    const fileContents = ns.read('servers.txt');
    // split the file contents into lines
    const servers = fileContents
        .split('\n') // split up each line
        .map(line => line.trim()) // remove any leading/trailing whitespace (\r)
        .filter(line => line.length > 0); // remove empty lines
    ns.printf("Servers: %s", servers)
  
    // --- CALCULATE REQUIRED RAM -----------------------
    // calculate total script ram usage
    let ram_req = files.reduce((total, file) => total + ns.getScriptRam(file), 0);
    ns.printf("total script ram required: %d", ram_req);
  
  
    // --- THE FUN STUFF -----------------------
    // copy scripts to server, get root access, and execute files on max threads
    for (const serv of servers) {
        // calculate max threads
        let threads = Math.floor((ns.getServerMaxRam(serv) - ns.getServerUsedRam(serv)) / ram_req);
        // bool to determine if the current server is hackable
        let hackable = true;
  
        // announce this portion
        ns.printf("Next server: %s", serv);
        await ns.sleep(1000);
  
        // check for current hack level vs. server
        if (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(serv)) {
          hackable = false;
        }
        // WHILE OPTION -- FOR SLEEPING TO WAIT INSTEAD
        //while (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(serv)) {
        //  await ns.sleep(60000);
        //}
  
        if (hackable && threads > 0) {
          switch (serv) {
              // n00dles is a baby server (4 GB RAM) so use early-hack-template instead
              case "n00dles":
                // copy file to server
                ns.scp("early-hack-template.js",serv);

                // if we don't have root access, fix that
                if (!ns.hasRootAccess(serv)) {
                await access(ns,serv,ns.getServerNumPortsRequired(serv));
                } // there's no nested `if` here because we should always have root access

                // launch scripts on server
                ns.printf("Launching script 'early-hack-template.js' on %s with 1 thread", serv);
                ns.exec("early-hack-template.js", serv);
                ns.printf("early-hack-template.js successfully running on %s", serv);

                // increment affected servers counter
                affect_server_count++;
                // add to list of affected servers
                affected_servers.push(serv);

                break;
              
              // literally anything else
              default:
                // copy files to server
                ns.scp(files,serv);
                //if (ns.scp(files,serv)) {
                //  ns.printf("copied files to %s", serv);
                //} else {
                //  ns.printf("scp failed to copy files '%s' to server %s",files, serv);
                //}
  
                // check that we have root access
                if (!ns.hasRootAccess(serv)) {
                  if (!await access(ns,serv,ns.getServerNumPortsRequired(serv))) {
                    // if we fail to get root access, exit early
                    ns.printf("Affected servers (%d): %s", affect_server_count, affected_servers);
                    return;
                  }
                }
  
                // execute scripts
                ns.printf("Launching scripts '%s' on %s with %d threads", files, serv, threads);
                await ns.sleep(500);
                await execFiles(ns, files, serv, threads);
  
                // update affected server list and count
                affect_server_count++;
                affected_servers.push(serv);
  
                ns.printf("All files successfully running on %s\n", serv);
          }
        } else {
          ns.printf("Current server %s is not currently hackable or has too few threads", serv);
        }
    }
  
    ns.print("DONE -- copying/executing scripts");
    ns.printf("Affected servers (%d): %s", affect_server_count, affected_servers);
  
    // output to file here
  
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
  