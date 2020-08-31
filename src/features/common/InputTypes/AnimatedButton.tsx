import { motion } from "framer-motion";

const AnimatedButton = (props: any) => {
    return (
        <motion.div whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }} {...props}>
            {props.children}
        </motion.div>
    )
}

export default AnimatedButton;
