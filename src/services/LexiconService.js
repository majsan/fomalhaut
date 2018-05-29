class LexiconService {

  constructor() {
    this.DEFAULT_OPERATORS = ['equals', 'startswith', 'endswith', 'regexp']
  }

  loadSets(lexicon) {
    // For now just return the sets list of the lexicon.
    // Later on we probably need to do more stuff
    return lexicon.sets
  }

  getSearchKeywordsForLexicon(lexDef) {
    return this.recGetKeywords(lexDef.structure, '')
  }

  recGetKeywords(struct, path) {
    let props = []
    if (struct.search) {
      let keywords = this.expandKeywords(struct.search)
      for (let keyword of keywords) {
        props.push({
          path: path,
          keyword: keyword.keyword,
          op: keyword.op,
          label: keyword.label || struct.label,
          main: struct.main || false,
          set: struct.set || null
        })
      }
    }
    if (struct.properties) {
      for (let propKey in struct.properties) {
        let prop = struct.properties[propKey]
        props = _.concat(props, this.recGetKeywords(prop, path + '.' + propKey))
      }
    }
    return props
  }


  /*

  The search parameter (search keywords) can be:

  search: 'baseform'
  search: ['baseform', 'gfC', ...]
  search: [{keyword: 'baseform', op: ['EQUALS', 'REGEXP', ...]}, ...]

  */

  expandKeywords(keywordOrKeywords) {
    if (_.isArray(keywordOrKeywords)) {
      return _.map(keywordOrKeywords, (keyword) => this.expandKeyword(keyword))
    } else {
      return [this.expandKeyword(keywordOrKeywords)]
    }
  }

  expandKeyword(keyword) {
    if (_.isString(keyword)) {
      // Expand to use the default operators
      return {keyword: keyword, op: this.DEFAULT_OPERATORS}
    } else {
      if (! keyword.op) {
        keyword.op = this.DEFAULT_OPERATORS
      }
      return keyword
    }
  }

  /* Make a tabular representation of the fields based on the order of tables, rows and columns for aggregated viewing */
  
  getTabularRepresentation(lexDef) {
    let tables = []
    this.visitNode(tables, lexDef.structure, {}, null)
    return this.sortTables(tables)
  } 

  visitNode(allTrees, node, tree, baseType, noRow) {
    // Visit all children
    if (node.table) {
      this.startNewTree(allTrees, node, node.noRow)
    }

      
    if (baseType === "ROW" || (baseType === "TABLE" && noRow )) {
      // Looking for columns
      let newOutNode = {node: node, children: []}
      if (node.column) {
        tree.children[0].children.push(newOutNode)
      } else {
        // Continue searching the tree for columns
        for (let propKey in node.properties) {
          let prop = node.properties[propKey]
          this.visitNode(allTrees, prop, tree.children[0], "ROW")
        }
      }
      
    } else if (baseType === "TABLE") {
      // Looking for rows
      let newOutNode = {node: node, children: []}
      if (node.row) {
        tree.children.push(newOutNode)
        for (let propKey in node.properties) {
          let prop = node.properties[propKey]
          this.visitNode(allTrees, prop, newOutNode, "ROW")
        }
      } else {
        for (let propKey in node.properties) {
          let prop = node.properties[propKey]
          this.visitNode(allTrees, prop, tree, "TABLE")
        }
      }
    }
    
    //return tree 
  }

  startNewTree(allTrees, node, noRow) {
    let tree
    if (noRow) {
      tree = {node: node, children: [{node : false, children: []}]}
    } else {
      tree = {node: node, children: []}
    }
    
    if (node.properties) {
      for (let propKey in node.properties) {
        let prop = node.properties[propKey]
        this.visitNode(allTrees, prop, tree, "TABLE", noRow)
      }
    }
    allTrees.push(tree)
  }

  /* Sorts the table representation based on the weights in the
     .table, .row and .column fields in the lexicon definition. */
  sortTables(tables) {
    tables = _.sortBy(tables, (t) => t.node.table)
    for (let table of tables) {
      table.children = _.sortBy(table.children, (r) => r.node.row)
      for (let row of table.children) {
        row.children = _.sortBy(row.children, (c) => c.node.column)
      }
    }
    return tables
  }


  /* Make a representation of the fields based on the order of columns or rows for aggregated viewing */
  getColumns(lexDef) {
    return _.sortBy(this.recGetColumns(lexDef.structure), 'column')
  }

  recGetColumns(struct) {
    let columns = []
    if (struct.column) {
      columns.push(struct)
    }
    if (struct.properties) {
      for (let propKey in struct.properties) {
        let prop = struct.properties[propKey]
        columns = _.concat(columns, this.recGetColumns(prop))
      } 
    }
    return columns
  }

  /* Augment each field in the lexicon structure with its path */
  augmentLexiconDefinitionWithPaths(struct, path) {
    struct.path = path
    if (struct.properties) {
      for (let propKey in struct.properties) {
        let prop = struct.properties[propKey]
        this.augmentLexiconDefinitionWithPaths(prop, path + '.' + propKey)
      }
    }
  }

}

const singleton = new LexiconService()
export default singleton