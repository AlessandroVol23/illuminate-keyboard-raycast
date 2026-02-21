import { execa } from "execa";
import { join } from "path";
import { environment } from "@raycast/api";
import { chmod } from "fs/promises";

const executeCommand = async (args: string[]) => {
  const command = join(environment.assetsPath, "keyboard");
  await chmod(command, "755");
  return await execa(command, args);
};

export async function getKeyboardBrightness() {
  const { stdout } = await executeCommand(["get"]);
  const { brightness } = JSON.parse(stdout) as { brightness: number };
  return brightness;
}

export async function setKeyboardBrightness(value: number) {
  await executeCommand(["set", String(value)]);
}
