from pathlib import Path

ROOT = Path(r"C:\Users\prakul\Desktop\projects\mechamind-os")

def replace(rel: str, old: str, new: str) -> None:
    path = ROOT / rel
    text = path.read_text(encoding="utf-8")
    if old not in text:
        raise RuntimeError(f"Expected text not found in {path}: {old[:80]!r}")
    path.write_text(text.replace(old, new), encoding="utf-8")

# Restore the schema module expected by user/rbac schemas while retaining the canonical implementation.
(ROOT / "backend/app/schemas/base.py").write_text(
    '"""Compatibility export for the common Pydantic schema base."""\n\n'
    'from app.schemas.response import BaseSchema\n\n'
    '__all__ = ["BaseSchema"]\n',
    encoding="utf-8",
)

replace(
    "frontend/src/components/ui/Badge.tsx",
    'variant?: "success" | "warning" | "danger" | "info" | "secondary";',
    'variant?: "default" | "success" | "warning" | "danger" | "info" | "secondary";',
)
replace(
    "frontend/src/components/ui/Badge.tsx",
    '"bg-gray-800 text-gray-400 border border-gray-700": variant === "secondary",',
    '"bg-gray-800 text-gray-400 border border-gray-700": variant === "secondary" || variant === "default",',
)
replace(
    "frontend/src/pages/ai/KnowledgeGraphExplorerPage.tsx",
    '          fitView\n          theme="dark"',
    '          fitView\n          colorMode="dark"',
)
replace(
    "frontend/src/pages/digitaltwin/ControlRoomPage.tsx",
    '  const mockAlarms = alarms || [',
    '  const mockAlarms: Array<{ id: string; severity: "critical" | "warning" | "info"; message: string; time: string }> = alarms || [',
)
replace(
    "frontend/src/components/analytics/AdvancedChart.tsx",
    '  title: string;',
    '  title?: string;',
)
replace(
    "frontend/src/components/analytics/AdvancedChart.tsx",
    '  series: { key: string; color: string; name: string }[];',
    '  series: { key?: string; dataKey?: string; color: string; name: string }[];',
)
replace(
    "frontend/src/components/analytics/AdvancedChart.tsx",
    'export const AdvancedChart = ({ title, type, data, xAxisKey = "name", series, height = 300 }: AdvancedChartProps) => {\n  const [isFullscreen, setIsFullscreen] = useState(false);',
    'export const AdvancedChart = ({ title = "", type, data, xAxisKey = "name", series, height = 300 }: AdvancedChartProps) => {\n  const [isFullscreen, setIsFullscreen] = useState(false);\n  const normalizedSeries = series.map((item) => ({ ...item, key: item.key ?? item.dataKey ?? "value" }));',
)
replace(
    "frontend/src/components/analytics/AdvancedChart.tsx",
    'series.map',
    'normalizedSeries.map',
)
replace(
    "frontend/src/components/analytics/AdvancedChart.tsx",
    'series[0].key',
    'normalizedSeries[0]?.key',
)
replace(
    "frontend/src/components/analytics/AdvancedChart.tsx",
    'series[index % series.length]?.color',
    'normalizedSeries[index % normalizedSeries.length]?.color',
)
replace(
    "frontend/src/routes.tsx",
    '], { future: { v7_startTransition: true } });',
    ']);',
)
print("Applied focused backend schema and frontend type/build repairs.")
