import {
  LoadingDots,
  Pagination,
  PaginationModel,
  getVisibleResultsMax,
  getVisibleResultsMin,
} from '@workday/canvas-kit-react'

const ListPagination: React.FC<{
  totalCount: number
  perPage: number
  isLoading: boolean
  model: PaginationModel
}> = ({ totalCount, perPage, isLoading, model }) => {
  return (
    <div>
      <Pagination
        aria-label="Pagination"
        model={model}
        backgroundColor={'#7d9fb1'}
        borderRadius={'80px'}
        marginTop={10}
        padding={10}
      >
        {!isLoading ? (
          <Pagination.Controls>
            <Pagination.JumpToFirstButton aria-label="First" aria-disabled />
            <Pagination.StepToPreviousButton aria-label="Previous" />
            <Pagination.PageList>
              {({ state }) =>
                state.range.map(pageNumber => (
                  <Pagination.PageListItem key={pageNumber}>
                    <Pagination.PageButton
                      aria-label={`Page ${pageNumber}`}
                      pageNumber={pageNumber}
                    />
                  </Pagination.PageListItem>
                ))
              }
            </Pagination.PageList>
            <Pagination.StepToNextButton aria-label="Next" />
            <Pagination.JumpToLastButton aria-label="Last" />
          </Pagination.Controls>
        ) : (
          <LoadingDots />
        )}
        <Pagination.AdditionalDetails color={'#cae0eb'}>
          {({ state }) =>
            `${getVisibleResultsMin(
              state.currentPage,
              perPage,
            )}-${getVisibleResultsMax(
              state.currentPage,
              perPage,
              totalCount,
            )} of ${totalCount} results`
          }
        </Pagination.AdditionalDetails>
      </Pagination>
    </div>
  )
}

export default ListPagination
