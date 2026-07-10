import React from "react";
import { LiveChart } from "@/components/iot/LiveChart";
import { GaugeChart } from "@/components/iot/GaugeChart";
import { useLiveSensorStream } from "@/hooks/useIotQueries";
import { Wifi } from "lucide-react";

export const SensorDashboardPage = () => {
  // Mocking 4 distinct live streams
  const vibDataM1 = useLiveSensorStream("vib-m1", 2.4, 0.8);
  const tempDataM1 = useLiveSensorStream("temp-m1", 65, 5);
  const pressureDataC1 = useLiveSensorStream("press-c1", 120, 15);
  const powerDataMain = useLiveSensorStream("pow-main", 480, 20);

  // Derive latest values for Gauges
  const vibCurrent = vibDataM1.length > 0 ? vibDataM1[vibDataM1.length - 1].value : 0;
  const tempCurrent = tempDataM1.length > 0 ? tempDataM1[tempDataM1.length - 1].value : 0;
  const pressCurrent = pressureDataC1.length > 0 ? pressureDataC1[pressureDataC1.length - 1].value : 0;
  const powCurrent = powerDataMain.length > 0 ? powerDataMain[powerDataMain.length - 1].value : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Wifi className="text-accent" /> Sensor Telemetry
          </h1>
          <p className="text-sm text-gray-500 mt-1">Live timeseries streams from Edge Gateways</p>
        </div>
      </div>

      {/* Gauges Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GaugeChart title="M1 Spindle Vib." value={vibCurrent} min={0} max={5} unit="mm/s" threshold={4.0} />
        <GaugeChart title="M1 Core Temp" value={tempCurrent} min={20} max={100} unit="°C" threshold={85} />
        <GaugeChart title="C1 Line Pressure" value={pressCurrent} min={0} max={200} unit="PSI" threshold={160} />
        <GaugeChart title="Main Bus Power" value={powCurrent} min={0} max={600} unit="kW" threshold={550} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <LiveChart title="M1 Spindle Vibration" data={vibDataM1} unit="mm/s" color="#ef4444" />
        <LiveChart title="M1 Core Temperature" data={tempDataM1} unit="°C" color="#f59e0b" />
        <LiveChart title="C1 Line Pressure" data={pressureDataC1} unit="PSI" color="#3b82f6" />
        <LiveChart title="Main Bus Power Consumption" data={powerDataMain} unit="kW" color="#14F195" />
      </div>
    </div>
  );
};
