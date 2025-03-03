/** @param {NS} ns */
export async function main(ns, target) {
  // Defines the "target server", which is the server
  // that we're going to hack
  target = ns.args.length > 0 ? ns.args[0] : ns.getHostname();

  // Defines how much money a server should have before we hack it
  // In this case, it is set to 75% of the maximum amount of money.
  const moneyThresh = ns.getServerMaxMoney(target)*.75;

  while(true) {
    if (ns.getServerMoneyAvailable(target) < moneyThresh) {
        // If the server's money is less than our threshold, grow it
        await ns.grow(target);
    }

    await ns.sleep(3000);
  }
}