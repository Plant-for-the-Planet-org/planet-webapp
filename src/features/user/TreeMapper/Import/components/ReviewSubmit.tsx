import React, { ReactElement } from 'react'

interface Props {
  handleNext: Function;
  errorMessage: String;
  setErrorMessage: Function;
}

export default function ReviewSubmit({handleNext,errorMessage,setErrorMessage}: Props): ReactElement {
    return (
        <div>
            Review and Submit
        </div>
    )
}
