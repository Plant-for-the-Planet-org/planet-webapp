import React, { ReactElement } from 'react'

interface Props {
  handleNext: Function;
  errorMessage: String;
  setErrorMessage: Function;
}

export default function SampleTrees({handleNext,errorMessage,setErrorMessage}: Props): ReactElement {
    return (
        <div>
            Sample Trees
        </div>
    )
}
