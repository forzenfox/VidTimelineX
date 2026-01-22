import * as React from "react"

// 设备断点定义
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440
} as const

export type DeviceType = 'mobile' | 'tablet' | 'desktop'

/**
 * 增强的设备检测钩子，支持移动端、平板和桌面设备检测
 * @returns 当前设备类型
 */
export function useDeviceDetect() {
  const [device, setDevice] = React.useState<DeviceType | undefined>(undefined)

  React.useEffect(() => {
    // 设备检测逻辑
    const detectDevice = (): DeviceType => {
      const width = window.innerWidth
      if (width < BREAKPOINTS.mobile) return 'mobile'
      if (width < BREAKPOINTS.tablet) return 'tablet'
      return 'desktop'
    }

    // 初始化设备检测
    setDevice(detectDevice())

    // 监听窗口大小变化
    const handleResize = () => {
      setDevice(detectDevice())
    }

    // 使用媒体查询API监听断点变化，性能更优
    const mobileMql = window.matchMedia(`(max-width: ${BREAKPOINTS.mobile - 1}px)`)
    const tabletMql = window.matchMedia(`(max-width: ${BREAKPOINTS.tablet - 1}px)`)

    const mqlHandler = () => {
      setDevice(detectDevice())
    }

    // 添加事件监听
    mobileMql.addEventListener("change", mqlHandler)
    tabletMql.addEventListener("change", mqlHandler)

    // 清理函数
    return () => {
      mobileMql.removeEventListener("change", mqlHandler)
      tabletMql.removeEventListener("change", mqlHandler)
    }
  }, [])

  return device
}

/**
 * 简化的移动端检测钩子，保持向后兼容
 * @returns 是否为移动端设备
 */
export function useIsMobile() {
  const device = useDeviceDetect()
  return device === 'mobile'
}

/**
 * 平板设备检测钩子
 * @returns 是否为平板设备
 */
export function useIsTablet() {
  const device = useDeviceDetect()
  return device === 'tablet'
}

/**
 * 桌面设备检测钩子
 * @returns 是否为桌面设备
 */
export function useIsDesktop() {
  const device = useDeviceDetect()
  return device === 'desktop'
}
