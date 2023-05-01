import { extendTheme } from "@chakra-ui/react"

const breakpoints = {
    xs: "25em",
    sm: "30em",
    md: "48em",
    lg: "62em",
    xl: "80em",
    "2xl": "96em",
}

export const colors = {
    background: "#282829"
}

const styles = {
    global: () => ({
        "::-webkit-scrollbar": {
            width: "5px"
        },
        "::-webkit-scrollbar-thumb": {
            background: "#4A4A4A",
            borderRadius: "30px",
        },
        "::-webkit-scrollbar-track": {
            background: "background"
        }
    })
}

const theme = extendTheme({
    styles,
    breakpoints,
    colors
})

export default theme