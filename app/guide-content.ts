import introduction from "../content/introduction.mdx?raw";
import hardware from "../content/hardware-check.mdx?raw";
import backupPc from "../content/back-up-old-pc.mdx?raw";
import downloadZima from "../content/download-zimaos.mdx?raw";
import flashUsb from "../content/flash-usb.mdx?raw";
import bootUsb from "../content/boot-usb.mdx?raw";
import installZima from "../content/install-zimaos.mdx?raw";
import dashboard from "../content/zima-dashboard.mdx?raw";
import reserveIp from "../content/reserve-ip.mdx?raw";
import installCrafty from "../content/install-crafty.mdx?raw";
import javaVersions from "../content/java-versions.mdx?raw";
import createFabric from "../content/create-fabric-server.mdx?raw";
import localTest from "../content/local-test.mdx?raw";
import fabricMods from "../content/fabric-mods.mdx?raw";
import fabricApi from "../content/fabric-api.mdx?raw";
import datapacks from "../content/datapacks.mdx?raw";
import modpack from "../content/modpack-for-friends.mdx?raw";
import serverSettings from "../content/server-settings.mdx?raw";
import playit from "../content/playit.mdx?raw";
import portForwarding from "../content/port-forwarding.mdx?raw";
import security from "../content/security.mdx?raw";
import performance from "../content/performance.mdx?raw";
import pregeneration from "../content/pregeneration.mdx?raw";
import backups from "../content/backups.mdx?raw";
import updates from "../content/updates.mdx?raw";
import management from "../content/server-management.mdx?raw";
import troubleshooting from "../content/troubleshooting.mdx?raw";
import askHelp from "../content/ask-for-help.mdx?raw";
import faq from "../content/faq.mdx?raw";

export const groups = ["Getting started", "Install ZimaOS", "Install Crafty", "Mods & gameplay", "Let friends join", "Keep it running", "Help"] as const;
export type Chapter = { slug: string; title: string; group: typeof groups[number]; time: string; summary: string; source: string };
export const chapters: Chapter[] = [
  { slug: "introduction", title: "Introduction", group: "Getting started", time: "8 min", summary: "Understand the pieces, the costs, and what self-hosting really means.", source: introduction },
  { slug: "hardware-check", title: "Hardware check", group: "Getting started", time: "10 min", summary: "Check the PC, storage, network, and realistic group size before erasing anything.", source: hardware },
  { slug: "back-up-old-pc", title: "Back up the old PC", group: "Getting started", time: "20–60 min", summary: "Save important files and make the installer drive unmistakable.", source: backupPc },
  { slug: "download-zimaos", title: "Download ZimaOS", group: "Install ZimaOS", time: "5 min", summary: "Get the current x86-64 installer image from the official source.", source: downloadZima },
  { slug: "flash-usb", title: "Flash the USB", group: "Install ZimaOS", time: "15 min", summary: "Turn a USB stick into bootable installation media with Balena Etcher.", source: flashUsb },
  { slug: "boot-usb", title: "Boot from USB", group: "Install ZimaOS", time: "10–25 min", summary: "Open the one-time boot menu and choose the UEFI USB entry safely.", source: bootUsb },
  { slug: "install-zimaos", title: "Install ZimaOS", group: "Install ZimaOS", time: "15–30 min", summary: "Choose the correct drive, install, remove the USB, and complete first boot.", source: installZima },
  { slug: "zima-dashboard", title: "Open the dashboard", group: "Install ZimaOS", time: "10 min", summary: "Find the server’s local address and create the first administrator account.", source: dashboard },
  { slug: "reserve-ip", title: "Reserve the local IP", group: "Install ZimaOS", time: "10–20 min", summary: "Ask the router to keep giving the server the same local address.", source: reserveIp },
  { slug: "install-crafty", title: "Install Crafty Controller", group: "Install Crafty", time: "15–30 min", summary: "Install the management panel, confirm storage paths, and secure the login.", source: installCrafty },
  { slug: "java-versions", title: "Understand Java versions", group: "Install Crafty", time: "8 min", summary: "Match Minecraft to the Java generation it expects and recognize version errors.", source: javaVersions },
  { slug: "create-fabric-server", title: "Create the Fabric server", group: "Install Crafty", time: "20–35 min", summary: "Build the server in Crafty, set memory, accept the EULA, and reach “Done.”", source: createFabric },
  { slug: "local-test", title: "Test on your LAN", group: "Install Crafty", time: "10–20 min", summary: "Join from home first. Public access comes only after this works.", source: localTest },
  { slug: "fabric-mods", title: "Fabric mods", group: "Mods & gameplay", time: "15 min", summary: "Know server-only, client-only, shared mods, dependencies, and safe download sources.", source: fabricMods },
  { slug: "fabric-api", title: "Fabric API", group: "Mods & gameplay", time: "5 min", summary: "Install the common library many Fabric mods need—without confusing it with Loader.", source: fabricApi },
  { slug: "datapacks", title: "Datapacks", group: "Mods & gameplay", time: "10 min", summary: "Place datapacks in the active world and confirm that Minecraft loaded them.", source: datapacks },
  { slug: "modpack-for-friends", title: "Make a modpack for friends", group: "Mods & gameplay", time: "20–40 min", summary: "Export a Modrinth profile so everyone gets matching client files.", source: modpack },
  { slug: "server-settings", title: "Server settings", group: "Mods & gameplay", time: "15 min", summary: "Set player count, distances, difficulty, MOTD, and safe online defaults.", source: serverSettings },
  { slug: "playit", title: "Set up Playit.gg", group: "Let friends join", time: "20–35 min", summary: "Create a tunnel to the server without changing the router.", source: playit },
  { slug: "port-forwarding", title: "Port forwarding alternative", group: "Let friends join", time: "20–45 min", summary: "Optionally expose only Minecraft’s TCP port through the router.", source: portForwarding },
  { slug: "security", title: "Whitelist & security", group: "Let friends join", time: "10 min", summary: "Protect player identity, limit operators, and keep dashboards private.", source: security },
  { slug: "performance", title: "Performance", group: "Keep it running", time: "15 min", summary: "Understand TPS, MSPT, CPU load, memory, storage, and the usual sources of lag.", source: performance },
  { slug: "pregeneration", title: "World pregeneration", group: "Keep it running", time: "10 min + runtime", summary: "Generate chunks before players explore, with a border and a backup.", source: pregeneration },
  { slug: "backups", title: "Automatic backups", group: "Keep it running", time: "15–25 min", summary: "Schedule Crafty backups, copy them elsewhere, and practise a restore.", source: backups },
  { slug: "updates", title: "Update safely", group: "Keep it running", time: "20–60 min", summary: "Back up, change one layer at a time, inspect logs, and test locally.", source: updates },
  { slug: "server-management", title: "Server management basics", group: "Keep it running", time: "10 min", summary: "Use start, stop, restart, console, files, metrics, schedules, and logs correctly.", source: management },
  { slug: "troubleshooting", title: "Troubleshooting centre", group: "Help", time: "As needed", summary: "Start with the symptom, check the likely cause, and fix one layer at a time.", source: troubleshooting },
  { slug: "ask-for-help", title: "How to ask for help", group: "Help", time: "5 min", summary: "Collect versions, hardware, logs, and the exact last change in one useful report.", source: askHelp },
  { slug: "faq", title: "Frequently asked questions", group: "Help", time: "12 min", summary: "Nuanced answers about hardware, cost, Java/Bedrock, remote access, and outages.", source: faq },
];
