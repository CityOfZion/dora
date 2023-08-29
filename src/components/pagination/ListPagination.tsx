import {
  LoadingDots,
  Pagination,
  PaginationModel,
  getVisibleResultsMax,
  getVisibleResultsMin,
} from '@workday/canvas-kit-react'

import './ListPagination.scss'

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
        backgroundColor={'transparent'}
        marginTop={10}
        padding={10}
        className="pagination"
      >
        {!isLoading ? (
          <Pagination.Controls>
            <Pagination.JumpToFirstButton
              aria-label="First"
              aria-disabled
              variant="inverse"
            />
            <Pagination.StepToPreviousButton
              aria-label="Previous"
              variant="inverse"
            />
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
            <Pagination.StepToNextButton aria-label="Next" variant="inverse" />
            <Pagination.JumpToLastButton aria-label="Last" variant="inverse" />
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
