import React, { ReactElement } from 'react'
import { shallow } from 'enzyme'
import toJson from 'enzyme-to-json'

import List from '../../components/list/List'

const columns = [
  {
    name: 'Test Label',
    accessor: 'test',
    style: { backgroundColor: 'purple' },
  },
  {
    name: 'Test Label 2',
    accessor: 'test2',
    style: { backgroundColor: 'purple' },
  },
]

const data = [
  {
    test: 123423445,
    test2: (): ReactElement => <div> hello test 2 </div>,
  },
  {
    test: 123423445,
    test2: (): ReactElement => <div> hello test 2 </div>,
  },
  {
    test: 123423445,
    test2: (): ReactElement => <div> hello test 2 </div>,
  },
  {
    test: 123423445,
    test2: (): ReactElement => <div> hello test 2 </div>,
  },
  {
    test: 123423445,
    test2: (): ReactElement => <div> hello test 2 </div>,
  },
]

test('renders without crashing', () => {
  const tree = shallow(
    <List
      columns={columns}
      data={data}
      rowId={'test'}
      handleRowClick={(row: {
        [key: string]: string | number | React.FC<{}>
      }): void => console.log(row)}
      isLoading={false}
    />,
  )
  expect(toJson(tree)).toMatchSnapshot()
})
