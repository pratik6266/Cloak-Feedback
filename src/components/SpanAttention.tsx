"use client"

import { motion } from "framer-motion"

export default function OtpSpamAlert() {
  return (
    <div className="flex text-2xl items-center justify-center py-2 px-3 bg-white rounded-md shadow-sm border border-gray-100">
      <div className="text-center">
        <motion.p className="text-xs font-medium text-gray-800">
          <span className="text-sm">Still waiting? Your</span>
          <motion.span
            animate={{
              opacity: [0.9, 1, 0.9],
              textShadow: ["0 0 0 rgba(0, 0, 0, 0)", "0 0 3px rgba(0, 0, 0, 0.3)", "0 0 0 rgba(0, 0, 0, 0)"],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
            className="mx-1 font-bold text-black"
          >
            <span className="text-sm">OTP</span>
          </motion.span>
          <span className="text-sm">could be in the</span>
          <motion.span
            animate={{
              color: ["#1f2937", "#000000", "#1f2937"],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
            className="relative mx-1 font-bold"
          >
            <span className="text-sm">Spam</span>
            <motion.span
              className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-800"
              animate={{
                scaleX: [0, 1, 1, 0],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                times: [0, 0.3, 0.7, 1],
                ease: "easeInOut",
              }}
            />
          </motion.span>
        </motion.p>

        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="h-1 bg-gradient-to-r from-gray-100 via-gray-800 mt-1 rounded-full bg-[length:200%_100%]"
        />
      </div>
    </div>
  )
}
