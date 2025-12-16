import { Popover as Popoverr } from '@base-ui/react/popover'
import { ArrowSvg } from './icons-tw.tsx'
import { motion, AnimatePresence } from 'motion/react'
import { useState } from 'react'

interface Prob {
  children: React.ReactNode
  renderPopover: React.ReactNode
  className: string
  initVaule?: boolean
}

const Popover = ({ className, children, renderPopover, initVaule = false }: Prob) => {
  const { Root, Trigger, Portal, Positioner, Popup, Arrow } = Popoverr
  const [open, setOpen] = useState(initVaule)
  return (
    <Root open={open} onOpenChange={setOpen}>
      <Trigger openOnHover>
        <div className={className}>{children}</div>
      </Trigger>
      <AnimatePresence>
        {open && (
          <Portal keepMounted>
            <Positioner sideOffset={8} align='end'>
              <Popup
                className='rounded-lg bg-white px-3 py-2 text-gray-900 shadow-lg shadow-gray-200 outline-1 outline-gray-200'
                render={
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ originX: 0.9, originY: -0.1 }}
                  />
                }
              >
                <Arrow className='data-[side=bottom]:-top-2 data-[side=left]:right-[-13px] data-[side=left]:rotate-90 data-[side=right]:left-[-13px] data-[side=right]:-rotate-90 data-[side=top]:-bottom-2 data-[side=top]:rotate-180'>
                  <ArrowSvg />
                </Arrow>
                {renderPopover}
              </Popup>
            </Positioner>
          </Portal>
        )}
      </AnimatePresence>
    </Root>
  )
}

export default Popover
