class AbstractTreeEntry {
  constructor(data) {
    this.keyExpr = data.keyExpr;
    this.parentExpr = data.parentExpr;
    this.allowChildren = data.allowChildren;
    this.items = data.items;
  }
  get options() {
    return {
      keyExpr: this.keyExpr,
      parentExpr: this.parentExpr,
      allowChildren: this.allowChildren
    }
  }
}

class AbstractGenericTree {
  get root() {
    const rootEntry = this.data[this.rootLevel];
    return {
      data: rootEntry.items[this.rootIndex],
      options: rootEntry.options
    }
  }
  
  constructor(data = [], rootLevel = 0, rootIndex = 0) {
    this.data = data.map(function(entryData) {
      return new AbstractTreeEntry(entryData);
    })
    this.rootLevel = rootLevel;
    this.rootIndex = rootIndex;
  }

  *traverseEntries() {
    for (let i = this.rootLevel; i < this.data.length; i++) {
      for (let k = 0, l = this.data[i].items.length; k < l; k++) {
        yield {
          data: this.data[i].items[k],
          options: this.data[i].options
        };
      }
    }
  }
}

class TreeNode {
  get key() {
    return this.data[this.keyExpr];
  }
  get parentKey() {
    return this.data[this.parentExpr];
  }
  constructor(data, options) {
    this.data = data;
    this.keyExpr = options.keyExpr;
    this.parentExpr = options.parentExpr;
    this.allowChildren = options.allowChildren;
    this.parentNode = null;
    this.firstChild = null;
    this.nextSibling = null;
  }
}

class GenericTree {
  constructor(root = null, asksAllowsChildren = true) {
    this.rootNode = root
    this.asksAllowsChildren = asksAllowsChildren;
  }

  getRoot() {
    return this.rootNode;
  }

  getPathToRoot() {

  }

  getChild(parent, index) {

  }

  getNodeByKey(key,value) {

  }

  getIndexOfChild(parent, child) {

  }

  getIndexOfNode(node) {

  }

  setRoot(root) {

  }

  insertNodeInto(newChild, parent, index) {

  }

  insertNextSibling(current, next) {
    if (!current.nextSibling) return current.nextSibling = next;
    return this.insertNextSibling(current.nextSibling, next);
  }

  insertNextChild(newChild, parent) {
    if (!parent.firstChild) return parent.firstChild = newChild;
    return this.insertNextSibling(parent.firstChild, newChild);
  }

  removeNodeFromParent(node) {

  }

  setAsksAllowsChildren(newValue) {

  }
  
  static setFromAbstractTree(abstractTree) {
    const treeNodes = new Map();
    const rootNode = new TreeNode(
      abstractTree.root.data, 
      abstractTree.root.options
    );
    
    let newNode;
    for (const { data, options } of abstractTree.traverseEntries()) {
      newNode = new TreeNode(data, options);
      if (treeNodes.has(newNode.key)) {
        console.warn('Passed argument includes non-unique keys across its data!')
        continue;
      }
      treeNodes.set(newNode.key, newNode);
    }

    let parent;
    for (const node of treeNodes.values()) {
      parent = treeNodes.get(node.parentKey);
      if (!parent || !parent.allowChildren) {
        this.insertNextSibling(node, rootNode);
        continue;
      }
      this.insertNextChild(node, parent);
    }

    return new GenericTree(rootNode);
  }
}

export { GenericTree, AbstractGenericTree };