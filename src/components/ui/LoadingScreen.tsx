import { motion } from 'framer-motion'
import { Gamepad2 } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gaming-bg flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className="inline-block"
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <Gamepad2 className="w-16 h-16 text-neon-blue mx-auto mb-6" />
        </motion.div>
        
        <motion.h1 
          className="text-3xl font-bold neon-text mb-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          个人游戏面板
        </motion.h1>
        
        <motion.div 
          className="flex space-x-1 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-neon-blue rounded-full"
              animate={{ 
                y: [0, -10, 0],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
        
        <motion.p 
          className="text-dark-300 mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          正在加载你的游戏数据...
        </motion.p>
      </div>
    </div>
  )
}

