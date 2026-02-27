"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

const THEMES = {
  light: "",
  dark: ".dark"
}

const ChartContext = React.createContext(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }
  return context
}

let chartCounter = 0

const ChartContainer = React.forwardRef(
  ({ id, className, children, config, ...props }, ref) => {
    const [chartId, setChartId] = React.useState(null)
    
    React.useEffect(() => {
      if (id) {
        setChartId(`chart-${id}`)
      } else {
        chartCounter++
        setChartId(`chart-${chartCounter}`)
      }
    }, [id])

    if (!chartId) {
      return <div className={cn(className)} {...props} />
    }

    return (
      <ChartContext.Provider value={{ config }}>
        <div
          data-chart={chartId}
          ref={ref}
          className={cn(
            "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
            className
          )}
          {...props}
        >
          <ChartStyle id={chartId} config={config} />
          <RechartsPrimitive.ResponsiveContainer>
            {children}
          </RechartsPrimitive.ResponsiveContainer>
        </div>
      </ChartContext.Provider>
    )
  }
)
ChartContainer.displayName = "ChartContainer"

const ChartStyle = ({ id, config }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
              .map(([key, itemConfig]) => {
                const color =
                  itemConfig.theme?.[theme] || itemConfig.color
                return color ? `  --color-${key}: ${color};` : null
              })
              .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef(
  ({ active, payload, label, labelFormatter, formatter, color, nameKey }, ref) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (labelFormatter) {
        return labelFormatter(label, payload)
      }

      if (typeof label === "string") {
        return label
      }

      return "Label"
    }, [label, labelFormatter, payload])

    if (!active || !payload || payload.length === 0) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl"
        )}
      >
        <div className="font-medium text-foreground">{tooltipLabel}</div>
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.dataKey || index}`
            const itemConfig = config[key]
            const value =
              formatter && item.value !== undefined
                ? formatter(item.value, item.name, item, index, item.payload)
                : item.value

            return (
              <div
                key={`${item.dataKey}-${index}`}
                className="flex w-full items-center justify-between gap-8"
              >
                <div className="flex items-center gap-1.5">
                  {item.color && (
                    <div
                      className="h-2 w-2 shrink-0 rounded-[2px]"
                      style={{
                        backgroundColor: item.color,
                      }}
                    />
                  )}
                  <span className="text-muted-foreground">
                    {itemConfig?.label || item.name}
                  </span>
                </div>
                <span className="font-mono font-medium text-foreground">
                  {value}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = RechartsPrimitive.Legend

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartStyle,
}
