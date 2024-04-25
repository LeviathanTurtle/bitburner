/** @param {NS} ns */

// 5.75 GB total RAM across 3 scripts
// 16 GB : 2 threads each (4.5 free)
// 32 GB : 5 threads each (3.25 free)
// 64 GB : 11 threads each (.75 free)
// 128 GB : 22 threads each (1.5 free)
// 256 GB : 

export async function main(ns) {
  // array of main files to copy and use
  const files = ["weaken-template.js", "hack-template.js", "grow-template.js"];
  //ns.tprint(`TEST: ns.getHostName = ${ns.getHostname()}`);

  // array of servers affected
  let affected_servers = [];
  // variable to see how many servers are affected
  let affect_server_count = 0;

  // calculate total script ram usage
  //let ram_req = 0;
  //for (let i=0; i < files.length; ++i) {
  //  ram_req += ns.getScriptRam(files[i]);
  //}
  let ram_req = files.reduce((total, file) => total + ns.getScriptRam(file), 0);
  ns.tprint(`total script ram required: ${ram_req}\n\n`);

  // read contents of the server list file
  const fileContents = ns.read('servers.txt');
  // split the file contents into lines
  const serverLines = fileContents.split('\n');
  // flatten the resulting arrays into MASTER SERVER ARRAY
  const servers = serverLines.flatMap(line => line.split(','));



  // copy scripts to server, get root access, and execute files on max threads
  for (let i = 0; i < servers.length; ++i) {
      const serv = servers[i];
      // calculate max threads
      let threads = Math.floor((ns.getServerMaxRam(serv) - ns.getServerUsedRam(serv)) / ram_req);
      // bool to determine if the current server is hackable
      let hackable = true;

      // announce this portion
      ns.tprint(`Next server: ${serv}. Beginning in 2s...`);
      await ns.sleep(2000);

      // check for current hack level vs. server
      if (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(serv)) {
        ns.tprint(`Current server ${serv} is not currently hackable\n\n`);
        hackable = false;
      }
      // WHILE OPTION FOR SLEEPING INSTEAD
      //while (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(serv)) {
      //  await ns.sleep(60000);
      //}

      if (hackable) {
        switch (serv) {
            // n00dles is a baby server (4 GB RAM) so use early-hack-template instead
            case "n00dles":
              // copy file to server
              ns.scp("early-hack-template.js",serv);

              // if we don't have root access, fix that
              if (!ns.hasRootAccess(serv)) {
                await access(ns,serv,ns.getServerNumPortsRequired(serv));
              } // there's no nested `if` here because this should always 

              // launch scripts on server
              ns.tprint(`Launching script 'early-hack-template.js' on ${serv} with 1 thread`);
              ns.exec("early-hack-template.js", serv);
              ns.tprint(`early-hack-template.js successfully running on ${serv}\n\n`);

              // increment affected servers counter
              affect_server_count++;
              // add to list of affected servers
              affected_servers.push(serv);

              break;
            
            // literally anything else
            default:
              // copy file to server
              if (ns.scp(files,serv)) {
                ns.tprint(`copied files to ${serv}`);
              } else {
                ns.tprint(`scp failed to copy files ${files} to server ${serv}`);
              }

              // check that we have root access
              if (!ns.hasRootAccess(serv)) {
                if (!await access(ns,serv,ns.getServerNumPortsRequired(serv))) {
                  ns.tprint(`Affected servers: ${affect_server_count}`);
                  return affected_servers;
                }
              }

              // if we have a valid thread count, proceed as normal
              if (threads > 0) {
                  // execute scripts
                  ns.tprint(`Launching scripts '${files}' on ${serv} with ${threads} threads in 1s...`);
                  await ns.sleep(1000);
                  await execFiles(ns, files, serv, threads);

                  // update affected server list and count
                  affect_server_count++;
                  affected_servers.push(serv);

                  ns.tprint(`All files successfully running on ${serv}\n\n`);
              } else { // not a valid thread count, cannot proceed
                ns.tprint(`Files not running on ${serv} due to invalid thread count (<= 0)\n\n`);
              }
          }
      }
  }

  ns.tprint("DONE -- copying/executing scripts");
  ns.tprint(`Affected servers: ${affect_server_count}`);

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
          if (ns.exec(file, target, threads)) {
              ns.tprint(`File ${file} running on ${target}`);
              setTimeout(() => executeFile(fileIndex + 1), 1000); // Execute next file after 1 second
          }
          // could not execute file
          else {
              ns.tprint(`Failed to start file ${file} on server ${target}`);
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
                ns.tprint(`BruteSSH-ing ${server} (${num_ports} ports) in 1s...`);
                await ns.sleep(1000);
                ns.brutessh(server);
                break;

            case "FTPCrack.exe":
                ns.tprint(`FTPCrack-ing ${server} (${num_ports} ports) in 1s...`);
                await ns.sleep(1000);
                ns.ftpcrack(server);
                break;

            case "RelaySMTP.exe":
                ns.tprint(`RelaySMTP-ing ${server} (${num_ports} ports) in 1s...`);
                await ns.sleep(1000);
                ns.relaysmtp(server);
                break;

            case "HTTPWorm.exe":
                ns.tprint(`HTTPWorm-ing ${server} (${num_ports} ports) in 1s...`);
                await ns.sleep(1000);
                ns.httpworm(server);
                break;

            case "SQLInject.exe":
                ns.tprint(`SQLInject-ing ${server} (${num_ports} ports) in 1s...`);
                await ns.sleep(1000);
                ns.sqlinject(server);
                break;
        }
    }

    // 
    ns.tprint(`Nuking ${server} in 1s...`);
    await ns.sleep(1000);
    ns.nuke(server);
    return true;
}
