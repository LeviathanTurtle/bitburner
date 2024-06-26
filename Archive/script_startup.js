/** @param {NS} ns */

// 5.75 GB total RAM across 3 scripts
// 16 GB : 2 threads each (4.5 free)
// 32 GB : 5 threads each (3.25 free)
// 64 GB : 11 threads each (.75 free)
// 128 GB : 22 threads each (1.5 free)
// 256 GB : 

// ADD RETURN servers_affected
export async function main(ns) {
  // array of main files to copy and use
  const files = ["weaken-template.js", "hack-template.js", "grow-template.js"];
  //ns.tprint(`TEST: ns.getHostName = ${ns.getHostname()}`);

  // array of servers affected
  let affected_servers = [];
  // variable to see how many servers are affected
  let affect_server_count = 0;

  // calculate total script ram usage
  let ram_req = 0;
  for (let i=0; i < files.length; ++i) {
    ram_req += ns.getScriptRam(files[i]);
  }
  //ns.tprint(`total script ram required: ${ram_req}\n\n`);

  // bool var for determining if malicious programs exist yet
  //let first = true;

  // Array of all servers that don't need any ports opened
  // to gain root access.
  const servers0Port = ["n00dles",          // 4 GB
                        "foodnstuff",       // 16 GB
                        "sigma-cosmetics",  // 16 GB
                        "joesguns",         // 16 GB
                        "nectar-net",       // 16 GB
                        "hong-fang-tea",    // 16 GB
                        "harakiri-sushi"    // 16 GB
  ];

  // Array of all servers that only need 1 port opened
  // to gain root access.
  const servers1Port = ["max-hardware",     // 32 GB
                        "neo-net",          // 32 GB
                        "zer0",             // 32 GB
                        "iron-gym"          // 32 GB
//                          "CSEC"              // 8 GB
  ];
  
  // Array of all servers that only need 2 ports opened
  // to gain root access.
  const servers2Port = ["phantasy",         // 32 GB
                        "omega-net",        // 32 GB
                        "silver-helix",     // 64 GB
                        "the-hub",          // 8 GB
//                          "avmnite-02h",      // 64 GB
//                          "johnson-ortho",    // 0 GB
//                          "crush-fitness"];   // 0 GB
                        "zb-institute"      // 128 GB
  ];
  
  // Array of all servers that only need 3 ports opened
  // to gain root access.
  const servers3Port = ["netlink",          // 64 GB
//                          "computek",         // 0 GB
                        "summit-uni",       // 64 GB
                        "catalyst",         // 64 GB
//                          "I.I.I.I",          // 256 GB
                        "rothman-uni",      // 32 GB
                        "millenium-fitness",// 32 GB
                        "rho-construction"  // 64 GB
  ];

  // Array of all servers that only need 4 ports opened
  // to gain root access.
  const servers4Port = [//"syscore"         // 0 GB
                        "lexo-corp",      // 64 GB
                        "aevum-police",   // 64 GB
//                          "zb-def",         // 0 GB
//                          "nova-med",       // 0 GB
                        "unitalife",      // 32 GB
                        "univ-energy",    // 16 GB
                        "global-pharm",   // 8 GB
                        "alpha-ent"       // 64 GB
//                          "snap-fitness",   // 0 B
  ];
  
  // Array of all servers that only need 5 ports opened
  // to gain root access.
  const servers5Port = ["zb-institute",   // 64 GB
//                          "galactic-cyber", // 0 GB
//                          "aerocorp",       // 0 GB
                        "omnia",          // 16 GB
//                          "defcomm",        // 0 GB
//                          "icarus",         // 0 GB
                        "solaris"         // 16 GB
//                          "infocomm",       // 0 GB
//                          "taiyang-digital",// 0 GB
//                          "deltaone",       // 0 GB
//                          "zeus-med",       // 0 GB
  ];

  // MAJOR NOTE: this can all be grouped together into one 
  // big for loop thanks to checks like 
  // ns.getServerNumPortsRequired(serv). I am not doing that
  // because I do not care enough to do so right now. 



  //ns.tprint("Beginning main loop - 0 port");
  // Copy our scripts onto each server that requires 0 ports to gain
  // root access. Then use nuke() to gain admin access and run the
  // scripts.
  for (let i = 0; i < servers0Port.length; ++i) {
      const serv = servers0Port[i];
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
            case "n00dles":
              //await copyFiles(ns, "early-hack-template.js", serv);
              ns.scp("early-hack-template.js",serv);

              //ns.nuke(serv);
              if (!ns.hasRootAccess(serv)) {
                await access(ns,serv,ns.getServerNumPortsRequired(serv));
              }

              ns.tprint(`Launching script 'early-hack-template.js' on ${serv} with 1 thread`);
              ns.exec("early-hack-template.js", serv);
              ns.tprint(`early-hack-template.js successfully running on ${serv}\n\n`);
              affect_server_count++;
              affected_servers.push(serv);

              break;
            
            default:
              //await copyFiles(ns, files, serv);
              if (ns.scp(files,serv)) {
                ns.tprint(`copied files to ${serv}`);
              } else {
                ns.tprint(`scp failed to copy files ${files} to server ${serv}`);
              }
              //ns.tprint(`test: files done copied to ${serv} and will run on ${threads} threads.`);

              // check that we have root access
              if (!ns.hasRootAccess(serv)) {
                await access(ns,serv,ns.getServerNumPortsRequired(serv));
              }

              // if we have a valid thread count, proceed as normal
              if (threads > 0) {
                  ns.tprint(`Launching scripts '${files}' on ${serv} with ${threads} threads in 1s...`);
                  await ns.sleep(1000);
                  await execFiles(ns, files, serv, threads);

                  // update affected server list and count
                  affect_server_count++;
                  affected_servers.push(serv);

                  ns.tprint(`All files successfully running on ${serv}\n\n`);
              } else { // not a valid thread count, cannot proceed
                ns.tprint(`Files not running on ${serv}\n\n`);
              }
          }
      }
  }


  
  // Wait until we acquire the "BruteSSH.exe" program
  //while (!ns.fileExists("BruteSSH.exe", "home")) {
  //    if (first) {
  //      ns.tprint("Sleeping until BruteSSH.exe exists...");
  //      first = false;
  //    }
  //    await ns.sleep(60000);
  //}
  //first = true;
  // IF VARIANT
  if (!ns.fileExists("BruteSSH.exe", "home")) {
      ns.tprint("File BruteSSH.exe does not exist.");
      ns.tprint(`Affected servers: ${affect_server_count}`);
      return affected_servers;
  }



  //ns.tprint("Beginning main loop - 1 port");
  // Copy our scripts onto each server that requires 1 port and 32 GB
  // to gain root access. Then use brutessh() and nuke() to gain
  // admin access and run the scripts.
  for (let i = 0; i < servers1Port.length; ++i) {
      const serv = servers1Port[i];
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
        if (ns.scp(files,serv)) {
          ns.tprint(`copied files to ${serv}`);
        } else {
          ns.tprint(`scp failed to copy files ${files} to server ${serv}`);
        }
        //ns.tprint(`test: files done copied to ${serv} and will run on ${threads} threads.`);

        //ns.tprint(`BruteSSH-ing ${serv} in 3s...`);
        //await ns.sleep(3000);
        //ns.brutessh(serv);
        //ns.tprint(`Nuking ${serv} in 3s...`);
        //await ns.sleep(3000);
        //ns.nuke(serv);
        if (!ns.hasRootAccess(serv)) {
          await access(ns,serv,ns.getServerNumPortsRequired(serv));
        }

        // if we have a valid thread count, proceed as normal
        if (threads > 0) {
            ns.tprint(`Launching scripts '${files}' on ${serv} with ${threads} threads in 1s...`);
            await ns.sleep(1000);
            await execFiles(ns, files, serv, threads);

            // update affected server list and count
            affect_server_count++;
            affected_servers.push(serv);

            ns.tprint(`All files successfully running on ${serv}\n\n`);
        } else { // not a valid thread count, cannot proceed
          ns.tprint(`Files not running on ${serv}\n\n`);
        }
      }
  }


  
  // Wait until we acquire the "FTPCrack.exe" program
  //while (!ns.fileExists("FTPCrack.exe", "home")) {
  //    if (first) {
  //      ns.tprint("Sleeping until FTPCrack.exe exists...");
  //      first = false;
  //    }
  //    await ns.sleep(60000);
  //}
  //first = true;
  // IF VARIANT
  if (!ns.fileExists("FTPCrack.exe", "home")) {
      ns.tprint("File FTPCrack.exe does not exist.");
      ns.tprint(`Affected servers: ${affect_server_count}`);
      return affected_servers;
  }



  //ns.tprint("Beginning main loop - 2 port");
  // Copy our scripts onto each server that requires 2 ports to gain
  // root access. Then use brutessh() and nuke() and ftpcrack() to
  // gain admin access and run the scripts.
  for (let i = 0; i < servers2Port.length; ++i) {
      const serv = servers2Port[i];
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
        if (ns.scp(files,serv)) {
          ns.tprint(`copied files to ${serv}`);
        } else {
          ns.tprint(`scp failed to copy files ${files} to server ${serv}`);
        }
        //ns.tprint(`test: files done copied to ${serv} and will run on ${threads} threads.`);

        if (!ns.hasRootAccess(serv)) {
          await access(ns,serv,ns.getServerNumPortsRequired(serv));
        }

        // if we have a valid thread count, proceed as normal
        if (threads > 0) {
            ns.tprint(`Launching scripts '${files}' on ${serv} with ${threads} threads in 1s...`);
            await ns.sleep(1000);
            await execFiles(ns, files, serv, threads);

            // update affected server list and count
            affect_server_count++;
            affected_servers.push(serv);

            ns.tprint(`All files successfully running on ${serv}\n\n`);
        } else { // not a valid thread count, cannot proceed
          ns.tprint(`Files not running on ${serv}\n\n`);
        }
      }
  }



  // Wait until we acquire the "RelaySMTP.exe" program
  //while (!ns.fileExists("RelaySMTP.exe", "home")) {
  //    if (first) {
  //      ns.tprint("Sleeping until RelaySMTP.exe exists...");
  //      first = false;
  //    }
  //    await ns.sleep(60000);
  //}
  //first = true;
  // IF VARIANT
  if (!ns.fileExists("RelaySMTP.exe", "home")) {
      ns.tprint("File RelaySMTP.exe does not exist.");
      ns.tprint(`Affected servers: ${affect_server_count}`);
      return affected_servers;
  }



  //ns.tprint("Beginning main loop - 3 port");
  // Copy our scripts onto each server that requires 3 ports to gain
  // root access. Then use ftpcrack(), brutessh(), relaysmtp, and
  // nuke() to gain admin access and run the scripts.
  for (let i = 0; i < servers3Port.length; ++i) {
      const serv = servers3Port[i];
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
        if (ns.scp(files,serv)) {
          ns.tprint(`copied files to ${serv}`);
        } else {
          ns.tprint(`scp failed to copy files ${files} to server ${serv}`);
        }
        //ns.tprint(`test: files done copied to ${serv} and will run on ${threads} threads.`);

        if (!ns.hasRootAccess(serv)) {
          await access(ns,serv,ns.getServerNumPortsRequired(serv));
        }

        // if we have a valid thread count, proceed as normal
        if (threads > 0) {
            ns.tprint(`Launching scripts '${files}' on ${serv} with ${threads} threads in 1s...`);
            await ns.sleep(1000);
            await execFiles(ns, files, serv, threads);

            // update affected server list and count
            affect_server_count++;
            affected_servers.push(serv);

            ns.tprint(`All files successfully running on ${serv}\n\n`);
        } else { // not a valid thread count, cannot proceed
          ns.tprint(`Files not running on ${serv}\n\n`);
        }
      }
  }



  // Wait until we acquire the "HTTPWorm.exe" program
  //while (!ns.fileExists("HTTPWorm.exe", "home")) {
  //    if (first) {
  //      ns.tprint("Sleeping until HTTPWorm.exe exists...");
  //      first = false;
  //    }
  //    await ns.sleep(60000);
  //}
  //first = true;
  // IF VARIANT
  if (!ns.fileExists("HTTPWorm.exe", "home")) {
      ns.tprint("File HTTPWorm.exe does not exist.");
      ns.tprint(`Affected servers: ${affect_server_count}`);
      return affected_servers;
  }



  //ns.tprint("Beginning main loop - 4 port");
  // Copy our scripts onto each server that requires 3 ports to gain
  // root access. Then use ftpcrack(), brutessh(), relaysmtp(),
  // httpworm(), and nuke() to gain admin access and run the scripts.
  for (let i = 0; i < servers4Port.length; ++i) {
      const serv = servers4Port[i];
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
        if (ns.scp(files,serv)) {
          ns.tprint(`copied files to ${serv}`);
        } else {
          ns.tprint(`scp failed to copy files ${files} to server ${serv}`);
        }
        //ns.tprint(`test: files done copied to ${serv} and will run on ${threads} threads.`);

        if (!ns.hasRootAccess(serv)) {
          await access(ns,serv,ns.getServerNumPortsRequired(serv));
        }

        // if we have a valid thread count, proceed as normal
        if (threads > 0) {
            ns.tprint(`Launching scripts '${files}' on ${serv} with ${threads} threads in 1s...`);
            await ns.sleep(1000);
            await execFiles(ns, files, serv, threads);

            // update affected server list and count
            affect_server_count++;
            affected_servers.push(serv);

            ns.tprint(`All files successfully running on ${serv}\n\n`);
        } else { // not a valid thread count, cannot proceed
          ns.tprint(`Files not running on ${serv}\n\n`);
        }
      }
  }



  // Wait until we acquire the "SQLInject.exe" program
  //while (!ns.fileExists("SQLInject.exe", "home")) {
  //    if (first) {
  //      ns.tprint("Sleeping until SQLInject.exe exists...");
  //      first = false;
  //    }
  //    await ns.sleep(60000);
  //}
  //first = true;
  // IF VARIANT
  if (!ns.fileExists("SQLInject.exe", "home")) {
      ns.tprint("File SQLInject.exe does not exist.");
      ns.tprint(`Affected servers: ${affect_server_count}`);
      return affected_servers;
  }



  //ns.tprint("Beginning main loop - 5 port");
  // Copy our scripts onto each server that requires 3 ports to gain
  // root access. Then use ftpcrack(), brutessh(), relaysmtp, and
  // nuke() to gain admin access and run the scripts.
  for (let i = 0; i < servers5Port.length; ++i) {
      const serv = servers5Port[i];
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
        if (ns.scp(files,serv)) {
          ns.tprint(`copied files to ${serv}`);
        } else {
          ns.tprint(`scp failed to copy files ${files} to server ${serv}`);
        }
        //ns.tprint(`test: files done copied to ${serv} and will run on ${threads} threads.`);

        if (!ns.hasRootAccess(serv)) {
          await access(ns,serv,ns.getServerNumPortsRequired(serv));
        }

        // if we have a valid thread count, proceed as normal
        if (threads > 0) {
            ns.tprint(`Launching scripts '${files}' on ${serv} with ${threads} threads in 1s...`);
            await ns.sleep(1000);
            await execFiles(ns, files, serv, threads);

            // update affected server list and count
            affect_server_count++;
            affected_servers.push(serv);

            ns.tprint(`All files successfully running on ${serv}\n\n`);
        } else { // not a valid thread count, cannot proceed
          ns.tprint(`Files not running on ${serv}\n\n`);
        }
      }
  }

  ns.tprint("DONE -- copying/executing scripts");
  ns.tprint(`Affected servers: ${affect_server_count}`);
  return affected_servers;
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
  return new Promise(async resolve => {
      switch (num_ports) {
          case 0:
              ns.tprint(`Nuking ${server} in 3s...`);
              await ns.sleep(3000);
              ns.nuke(server);

              resolve(true);
              break;
          case 1:
              ns.tprint(`BruteSSH-ing ${server} (${num_ports} ports) in 3s...`);
              await ns.sleep(3000);
              ns.brutessh(server);
              
              ns.tprint(`Nuking ${server} in 3s...`);
              await ns.sleep(3000);
              ns.nuke(server);

              resolve(true);
              break;
          case 2:
              ns.tprint(`FTPCrack-ing ${server} (${num_ports} ports) in 3s...`);
              await ns.sleep(3000);
              ns.ftpcrack(server);

              ns.tprint(`BruteSSH-ing ${server} (${num_ports} ports) in 3s...`);
              await ns.sleep(3000);
              ns.brutessh(server);

              ns.tprint(`Nuking ${server} in 3s...`);
              await ns.sleep(3000);
              ns.nuke(server);

              resolve(true);
              break;
          case 3:
              ns.tprint(`RelaySMTP-ing ${server} (${num_ports} ports) in 3s...`);
              await ns.sleep(3000);
              ns.relaysmtp(server);
              
              ns.tprint(`FTPCrack-ing ${server} (${num_ports} ports) in 3s...`);
              await ns.sleep(3000);
              ns.ftpcrack(server);

              ns.tprint(`BruteSSH-ing ${server} (${num_ports} ports) in 3s...`);
              await ns.sleep(3000);
              ns.brutessh(server);

              ns.tprint(`Nuking ${server} in 3s...`);
              await ns.sleep(3000);
              ns.nuke(server);

              resolve(true);
              break;
          case 4:
              ns.tprint(`HTTPWorm-ing ${server} (${num_ports} ports) in 3s...`);
              await ns.sleep(3000);
              ns.httpworm(server);

              ns.tprint(`RelaySMTP-ing ${server} (${num_ports} ports) in 3s...`);
              await ns.sleep(3000);
              ns.relaysmtp(server);
              
              ns.tprint(`FTPCrack-ing ${server} (${num_ports} ports) in 3s...`);
              await ns.sleep(3000);
              ns.ftpcrack(server);

              ns.tprint(`BruteSSH-ing ${server} (${num_ports} ports) in 3s...`);
              await ns.sleep(3000);
              ns.brutessh(server);

              ns.tprint(`Nuking ${server} in 3s...`);
              await ns.sleep(3000);
              ns.nuke(server);

              resolve(true);
              break;
          case 5:
              ns.tprint(`SQLInject-ing ${server} (${num_ports} ports) in 3s...`);
              await ns.sleep(3000);
              ns.sqlinject(server);
              
              ns.tprint(`HTTPWorm-ing ${server} (${num_ports} ports) in 3s...`);
              await ns.sleep(3000);
              ns.httpworm(server);

              ns.tprint(`RelaySMTP-ing ${server} (${num_ports} ports) in 3s...`);
              await ns.sleep(3000);
              ns.relaysmtp(server);
              
              ns.tprint(`FTPCrack-ing ${server} (${num_ports} ports) in 3s...`);
              await ns.sleep(3000);
              ns.ftpcrack(server);

              ns.tprint(`BruteSSH-ing ${server} (${num_ports} ports) in 3s...`);
              await ns.sleep(3000);
              ns.brutessh(server);

              ns.tprint(`Nuking ${server} in 3s...`);
              await ns.sleep(3000);
              ns.nuke(server);

              resolve(true);
              break;
      }
  });

  // I think this can also be reduced
}