/** @param {NS} ns */
export async function main(ns) {
  const files = ["weaken-template.js", "hack-template.js", "grow-template.js"];
  
  // KILL SCRIPT TEST
  const servers = "foodnstuff";
  ns.scriptKill(`weaken-template.js ["${servers}"]`);
  ns.scriptKill(`hack-template.js ["${servers}"]`);
  ns.scriptKill(`grow-template.js ["${servers}"]`);

  ns.killall()



  // RAM TEST
/*
  let ram_req = -4;
  for (let i=0; i < files.length; ++i) {
    ram_req += ns.getScriptRam(files[i]);
  }
  //ns.tprint(`total script ram required: ${ram_req}\n\n`);

  let threads = Math.floor((128 - 0) / ram_req / 25);
  ns.tprint(`threads: ${threads}`);
*/
}