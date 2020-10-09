import React, { FC, useEffect, useState } from 'react'
import { Flex } from '../../ds'
import { Tree } from 'antd'
import set from 'set-value'
import useComponents from '../../hooks/common/useComponents'
import useSelectedComponent from '../../hooks/preview/useSelectedComponent'

const { DirectoryTree } = Tree

const treeObjectToData = (tree, pathArray: Array<string> = []) =>
  Object.keys(tree).map(key =>
    tree[key].leaf
      ? { title: tree[key].component.name, key: [...pathArray, key].join('/'), isLeaf: true }
      : {
          title: key,
          key: [...pathArray, key].join('/'),
          children: treeObjectToData(tree[key], [...pathArray, key]),
          selectable: false
        }
  )

const componentArrayToTree = components => {
  const tree = {}
  components.map(component => {
    const { key } = component
    set(tree, key.replace(/\//g, '.'), { key, component, leaf: true })
  })

  return tree
}

// @ts-ignore
const Selector: FC = () => {
  const { components } = useComponents()
  const { key: selectedComponent, setSelectedComponent } = useSelectedComponent()

  const [tree, setTree] = useState(undefined)

  useEffect(() => {
    setTree(components ? treeObjectToData(componentArrayToTree(components)) : undefined)
  }, [components])

  const onSelect = keys => {
    if (keys && keys.length >= 0) {
      setSelectedComponent(keys[0])
    }
  }

  return (
    <Flex direction="column" height="full" vertical width="full" padding="none" backgroundColor="white">
      {tree ? (
        <DirectoryTree
          showIcon={false}
          multiple
          defaultExpandAll
          treeData={tree}
          onSelect={onSelect}
          selectedKeys={[selectedComponent as any]}
          itemHeight={22}
        />
      ) : null}
    </Flex>
  )
}

export default Selector
