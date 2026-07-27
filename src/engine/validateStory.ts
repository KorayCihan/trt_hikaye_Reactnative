import type { Story, StoryImageMap, StoryValidation, ValidationIssue } from '@/types/story';

export function validateStory(story: Story, images: StoryImageMap = {}): StoryValidation {
  const issues: ValidationIssue[] = [];
  const nodeIds = new Set(Object.keys(story.nodes));
  const reachableNodeIds = new Set<string>();
  const activePath = new Set<string>();
  const missingImages = new Set<string>();
  let hasCycle = false;
  let endingCount = 0;

  if (!nodeIds.has(story.startNodeId)) {
    issues.push({
      type: 'error',
      code: 'missing-start',
      message: `Başlangıç düğümü bulunamadı: ${story.startNodeId}`,
    });
  }

  // Önce her düğümün kendi bağlantılarını ve görsellerini denetleriz.
  for (const node of Object.values(story.nodes)) {
    if (node.isEnding) {
      endingCount += 1;
      if (node.choices.length > 0) {
        issues.push({
          type: 'error',
          code: 'ending-has-choices',
          nodeId: node.id,
          message: 'Final düğümünde seçenek bulunamaz.',
        });
      }
    }

    if (!images[node.backgroundImage]) {
      missingImages.add(node.backgroundImage);
      issues.push({
        type: 'warning',
        code: 'missing-image',
        nodeId: node.id,
        message: `Görsel bulunamadı: ${node.backgroundImage}`,
      });
    }

    for (const choice of node.choices) {
      if (!nodeIds.has(choice.nextNodeId)) {
        issues.push({
          type: 'error',
          code: 'invalid-link',
          nodeId: node.id,
          message: `${choice.id} geçersiz düğüme gidiyor: ${choice.nextNodeId}`,
        });
      }

      if (choice.transitionImageKey && !images[choice.transitionImageKey]) {
        missingImages.add(choice.transitionImageKey);
        issues.push({
          type: 'error',
          code: 'missing-transition-image',
          nodeId: node.id,
          message: `Geçiş görseli bulunamadı: ${choice.transitionImageKey}`,
        });
      }
    }
  }

  if (endingCount === 0) {
    issues.push({ type: 'error', code: 'no-ending', message: 'Hikâyede en az bir final olmalı.' });
  }

  // Derinlik öncelikli tarama, başlangıçtan erişilemeyen düğümleri bulur.
  function visit(nodeId: string) {
    if (activePath.has(nodeId)) {
      hasCycle = true;
      return;
    }
    if (!nodeIds.has(nodeId) || reachableNodeIds.has(nodeId)) return;

    activePath.add(nodeId);
    reachableNodeIds.add(nodeId);
    story.nodes[nodeId].choices.forEach((choice) => visit(choice.nextNodeId));
    activePath.delete(nodeId);
  }

  visit(story.startNodeId);

  if (hasCycle) {
    issues.push({ type: 'warning', code: 'cycle', message: 'Hikâyede bir döngü tespit edildi.' });
  }

  const unreachableNodeIds = [...nodeIds].filter((nodeId) => !reachableNodeIds.has(nodeId));
  unreachableNodeIds.forEach((nodeId) => {
    issues.push({
      type: 'warning',
      code: 'unreachable',
      nodeId,
      message: 'Bu düğüme başlangıçtan ulaşılamıyor.',
    });
  });

  return {
    valid: !issues.some((issue) => issue.type === 'error'),
    issues,
    unreachableNodeIds,
    missingImages: [...missingImages],
  };
}
