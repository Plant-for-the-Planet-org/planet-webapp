import React, { ReactElement } from 'react'

interface Props {
  handleNext: Function;
  errorMessage: String;
  setErrorMessage: Function;
  plantLocation: Object;
}

export default function ReviewSubmit({handleNext,errorMessage,setErrorMessage,plantLocation}: Props): ReactElement {
    console.log(`plantLocation`, plantLocation)
    return (
        <div>
            print
            {JSON.stringify(plantLocation)}
        </div>
    )
}
