import { motion } from "framer-motion";

const TeddyBear = ({ size = 80, className = "" }: { size?: number; className?: string }) => (
  <motion.div
    className={`inline-block ${className}`}
    animate={{ rotate: [-3, 3, -3] }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    style={{ fontSize: `${size}px`, lineHeight: 1 }}
  >
    🧸
  </motion.div>
);

export default TeddyBear;
