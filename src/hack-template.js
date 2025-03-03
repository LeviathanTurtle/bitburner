/** @param {NS} ns */
export async function main(ns, target) {
  // Defines the "target server", which is the server
  // that we're going to hack
  target = ns.args.length > 0 ? ns.args[0] : ns.getHostname();

  // Infinite loop that continously hacks/grows/weakens the target server
  while(true) {
    await ns.hack(target);
    await ns.sleep(3000);
  }
}