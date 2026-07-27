import type { Story } from '@/types/story';

/** Başlangıç düğümünden finallere giden olası yolları listeler. */
export function listStoryPaths(story: Story, limit = 100) {
  const paths: string[][] = [];

  function walk(nodeId: string, currentPath: string[]) {
    if (paths.length >= limit) return;

    const node = story.nodes[nodeId];
    const path = [...currentPath, nodeId];

    // Eksik düğüm, final veya döngü gördüğümüzde o yolu tamamlanmış sayarız.
    if (!node || node.isEnding || currentPath.includes(nodeId)) {
      paths.push(path);
      return;
    }

    node.choices.forEach((choice) => walk(choice.nextNodeId, path));
  }

  walk(story.startNodeId, []);
  return paths;
}
