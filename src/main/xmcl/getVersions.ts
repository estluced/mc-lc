import { getVersionList, MinecraftVersion } from '@xmcl/installer';

async function getVersions(): Promise<MinecraftVersion[]> {
  return (await getVersionList()).versions;
}

export default getVersions;
