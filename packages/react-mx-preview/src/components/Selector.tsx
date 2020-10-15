import React, { FC, useEffect, useState } from 'react'
import { Flex, Header } from '../ds'
import { Input, Tree, Empty } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import set from 'set-value'
import useComponents from '../hooks/common/useComponents'
import useSelectedComponent from '../hooks/preview/useSelectedComponent'

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

  const [tree, setTree] = useState<any>([])
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined)

  useEffect(() => {
    setTree(
      components
        ? treeObjectToData(
            componentArrayToTree(
              searchTerm && searchTerm !== undefined
                ? components.filter(component => component.name.toLowerCase().includes(searchTerm.toLowerCase()))
                : components
            )
          )
        : undefined
    )
  }, [components, searchTerm])

  const onSelect = keys => {
    if (keys && keys.length >= 0) {
      setSelectedComponent(keys[0])
    }
  }

  return (
    <Flex flex="1" direction="column" height="full" vertical width="full" padding="none" backgroundColor="white">
      <Header light={true} borderBottom="1px" borderBottomColor="lighterBorder">
        <Input
          size="small"
          prefix={<SearchOutlined />}
          placeholder="search componenet"
          value={searchTerm}
          allowClear={true}
          onChange={e => {
            setSearchTerm(e.target.value)
          }}
        />
      </Header>
      {tree && tree.length > 0 ? (
        <DirectoryTree
          showIcon={false}
          multiple
          defaultExpandAll
          treeData={tree}
          onSelect={onSelect}
          selectedKeys={[selectedComponent as any]}
          itemHeight={22}
        />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={searchTerm ? 'No components found' : 'No components loaded'}
        />
      )}
    </Flex>
  )
}

export default Selector
