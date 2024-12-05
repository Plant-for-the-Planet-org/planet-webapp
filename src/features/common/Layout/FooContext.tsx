import { useContext, FC, useState, createContext, ReactNode } from "react";

// define the interface of the context, basically the methods and data that will be shared
interface FooContextInterface {
    fooData: string; // The shared data
    addFooData: (data: string) => void; // Method to add data
    clearFooData: () => void; // Method to clear data
}

// this function can be used to create the context
// it is called by the provider to create the context
export const FooContext = createContext<FooContextInterface | null>(null);

export const FooContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    // State to hold the shared data
    const [fooData, setFooData] = useState<string>('');

    // Method to add data
    const addFooData = (data: string) => {
        setFooData(data);
    };

    // Method to clear data
    const clearFooData = () => {
        setFooData('');
    };

    return (
        <FooContext.Provider
            value={{
                fooData,
                addFooData,
                clearFooData,
            }}
        >
            {children}
        </FooContext.Provider>
    );
};

export const useFooContext = (): FooContextInterface => {
    const context = useContext(FooContext);
    if (!context) {
        throw new Error("FooContext must be used within FooContextProvider");
    }
    return context;
};
