import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Zap } from "lucide-react";

export const ThinkingAnimation = () => {
  const circleVariants = {
    initial: { scale: 0, rotate: 0 },
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 360],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }
    },
    exit: { scale: 0, rotate: 0 }
  };

  const particleVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: (i: number) => ({
      y: [-20, -40, -20],
      x: [-20 + i * 20, -10 + i * 20, -20 + i * 20],
      opacity: [0.5, 1, 0.5],
      scale: [0.8, 1.2, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        delay: i * 0.2,
        ease: "easeInOut"
      }
    }),
    exit: { opacity: 0, scale: 0 }
  };

  const brainVariants = {
    initial: { scale: 0 },
    animate: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    exit: { scale: 0 }
  };

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="flex flex-col items-center justify-center h-full"
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        layout
      >
        <motion.div
          className="relative"
          animate={{
            y: [0, -10, 0],
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          {/* Outer rotating circle */}
          <motion.div
            className="absolute inset-0 w-32 h-32 rounded-full border-4 border-blue-400/30"
            variants={circleVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            layout
          />
          
          {/* Inner circle with gradient */}
          <motion.div
            className="relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
            variants={brainVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            layout
          >
            <Brain className="w-12 h-12 text-white" />
          </motion.div>

          {/* Floating particles */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute -top-4"
              custom={i}
              variants={particleVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              layout
            >
              {i % 2 === 0 ? (
                <Sparkles className="w-6 h-6 text-yellow-400" />
              ) : (
                <Zap className="w-6 h-6 text-blue-400" />
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-8 text-center"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Your Data</h3>
          <p className="text-gray-600">
            Discovering patterns, trends, and insights...
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}; 