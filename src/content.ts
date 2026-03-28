import {
  selectTargetNode,
  additionalConfig,
  mutationMatchCondition,
  handleTarget
} from "./logic"

console.log("[Gemini Remove User Bubble Max Height] [content script started]")

// run logic
waitForTargetNode(selectTargetNode, (targetNode) => {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutationMatchCondition(mutation)) {
        mutation.addedNodes.forEach((node) => {
          const target = node as Element
          handleTarget(target)
        })
      }
    }
  })
  observer.observe(targetNode, {
    childList: true,
    subtree: true,
    ...additionalConfig
  })
})

// util
function waitForTargetNode(
  selectorFunc: () => Node | null,
  callback: (node: Node) => void
) {
  const element = selectorFunc()
  // 1. if element exists, run callback immediately
  if (element) {
    callback(element)
    return
  }
  console.log(
    "[Gemini Remove User Bubble Max Height] [target node is null] [waiting..]"
  )

  // 2. if it doesn't exist, wait for it and then run callback
  const observer = new MutationObserver((mutations, obs) => {
    const target = selectorFunc()
    if (target) {
      if (import.meta.env.MODE === "development")
        console.log(
          "[Gemini Remove User Bubble Max Height] [target node found!]",
          target
        )
      else
        console.log(
          "[Gemini Remove User Bubble Max Height] [target node found!]"
        )
      obs.disconnect()
      callback(target)
    }
  })
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}
