export function selectTargetNode(): Node | null {
  return document.querySelector("chat-window-content")
}

export const additionalConfig = {}

export function mutationMatchCondition(mutation: MutationRecord) {
  return mutation.type === "childList" && mutation.addedNodes.length > 0
}

export function handleTarget(target: Node) {
  // https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord/target#value
  let element = target as Element

  // 1. Node is button
  if (
    element.nodeType === 1 &&
    element.matches('button[aria-label="Collapse"]')
  ) {
    applyStyle(element)
  }

  // 2. Button is child of added node
  if (element.nodeType === 1) {
    const btn = element.querySelector('button[aria-label="Collapse"]')
    if (btn) {
      applyStyle(element)
    }
  }
}

function applyStyle(element: Element) {
  const bubbleTextContainer = element.parentElement!.children[0] as HTMLElement
  // Remove max height
  bubbleTextContainer.style.maxHeight = "none"
}
