/** @param {NS} ns */
export async function main(ns, target) {
    // Defines the "target server", which is the server
    // that we're going to hack
    target = ns.args.length > 0 ? ns.args[0] : ns.getHostname();
  
    // Defines the maximum security level the target server can
    // have. If the target's security level is higher than this,
    // we'll weaken it before doing anything else
    const securityThresh = ns.getServerMinSecurityLevel(target);
  
    // Infinite loop that continously hacks/grows/weakens the target server
    while(true) {
      if (ns.getServerSecurityLevel(target) > securityThresh) {
          // If the server's security level is above our threshold, weaken it
          await ns.weaken(target);
      }
      
      await ns.sleep(3000);
    }
  
  }