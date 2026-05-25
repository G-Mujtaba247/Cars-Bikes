/**
 * ComparePage Component - Vehicle comparison page
 * Features: Side-by-side comparison, vehicle selector, specs table, share comparison
 */
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { GitCompare, Plus, ArrowRight, Car, Bike, X, Search, Play, Flame, Trophy, RotateCcw } from 'lucide-react';
import { useVehicle } from '../context/VehicleContext';
import ComparisonTable from '../components/ComparisonTable';

// Extends specs parsing utility
function parseNumber(str) {
  if (!str) return 0;
  const match = String(str).match(/([0-9.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

// Extends weight parsing for physics equations
function parseWeight(str, type) {
  if (!str) return type === 'car' ? 1200 : 180; // Default weights in kg
  const match = String(str).match(/([0-9.]+)/);
  return match ? parseFloat(match[1]) : (type === 'car' ? 1200 : 180);
}

// Custom interactive Drag Strip Race Simulator
function DragStripSimulation({ vehicleA, vehicleB }) {
  const [raceStatus, setRaceStatus] = useState('idle'); // 'idle' | 'countdown' | 'racing' | 'finished'
  const [countdown, setCountdown] = useState(3);
  const [posA, setPosA] = useState(0);
  const [posB, setPosB] = useState(0);
  const [winner, setWinner] = useState(null);
  const [verdict, setVerdict] = useState('');
  
  const timerRef = useRef(null);
  const animRef = useRef(null);

  const powerA = parseNumber(vehicleA.power);
  const weightA = parseWeight(vehicleA.specifications?.kerbWeight || vehicleA.specifications?.weight, vehicleA.type);
  const ratioA = powerA / weightA;

  const powerB = parseNumber(vehicleB.power);
  const weightB = parseWeight(vehicleB.specifications?.kerbWeight || vehicleB.specifications?.weight, vehicleB.type);
  const ratioB = powerB / weightB;

  const startRace = () => {
    setRaceStatus('countdown');
    setCountdown(3);
    setPosA(0);
    setPosB(0);
    setWinner(null);
    setVerdict('');

    let count = 3;
    timerRef.current = setInterval(() => {
      count -= 1;
      if (count === 0) {
        clearInterval(timerRef.current);
        setCountdown(0);
        setRaceStatus('racing');
      } else {
        setCountdown(count);
      }
    }, 800);
  };

  useEffect(() => {
    if (raceStatus !== 'racing') return;

    let pA = 0;
    let pB = 0;
    
    // Accel based on real weight-to-power and engine torque curves
    const accelA = (ratioA * 260) + (parseNumber(vehicleA.torque) / 90) + Math.random() * 0.15;
    const accelB = (ratioB * 260) + (parseNumber(vehicleB.torque) / 90) + Math.random() * 0.15;

    const runRace = () => {
      // Sweeping positions along drag road
      pA += (accelA * 0.04) + (Math.random() * 0.18);
      pB += (accelB * 0.04) + (Math.random() * 0.18);

      setPosA(Math.min(pA, 85));
      setPosB(Math.min(pB, 85));

      if (pA >= 85 || pB >= 85) {
        setRaceStatus('finished');
        if (pA >= 85 && pB >= 85) {
          setWinner(ratioA >= ratioB ? vehicleA : vehicleB);
        } else if (pA >= 85) {
          setWinner(vehicleA);
        } else {
          setWinner(vehicleB);
        }
      } else {
        animRef.current = requestAnimationFrame(runRace);
      }
    };

    animRef.current = requestAnimationFrame(runRace);

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [raceStatus]);

  useEffect(() => {
    if (raceStatus !== 'finished' || !winner) return;

    const loser = winner.id === vehicleA.id ? vehicleB : vehicleA;
    const winRatio = winner.id === vehicleA.id ? ratioA : ratioB;
    const loseRatio = winner.id === vehicleA.id ? ratioB : ratioA;
    const ratioDiff = ((winRatio / (loseRatio || 1) - 1) * 100).toFixed(0);

    let reasonText = '';
    if (parseFloat(ratioDiff) > 18) {
      reasonText = `The ${winner.name} completely dominated the strip due to a massive power-to-weight ratio advantage of ${ratioDiff}%. It surged off the starting line!`;
    } else {
      reasonText = `A thrilling photo finish! The ${winner.name} narrowly edged out the ${loser.name} thanks to a slightly better power-to-weight delivery (${(winRatio * 1000).toFixed(1)} hp/ton vs ${(loseRatio * 1000).toFixed(1)} hp/ton).`;
    }

    setVerdict(reasonText);
  }, [raceStatus, winner]);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className="carbon-texture p-6 sm:p-8 rounded-3xl mb-8 relative overflow-hidden headlight-glow">
      <div className="absolute inset-0 bg-mesh opacity-15" />
      
      {/* Title */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-sm font-extrabold font-display text-white uppercase tracking-wider flex items-center gap-2">
          <Flame className="w-5 h-5 text-accent-500 animate-pulse-slow" />
          Quarter-Mile Drag Strip Simulation
        </h3>
        {(raceStatus === 'idle' || raceStatus === 'finished') && (
          <button
            onClick={startRace}
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase bg-gradient-to-r from-accent-500 to-primary-500 hover:from-accent-400 hover:to-primary-400 text-white flex items-center gap-1.5 transition-all shadow-lg shadow-accent-500/25"
          >
            {raceStatus === 'finished' ? <RotateCcw className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            {raceStatus === 'finished' ? 'Race Again' : 'Start Race'}
          </button>
        )}
      </div>

      {/* Countdown Panel */}
      {raceStatus === 'countdown' && (
        <div className="flex flex-col items-center justify-center py-4 relative z-10 animate-fade-in">
          <div className="bg-dark-950/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-4">
            <span className="text-xs font-black text-gray-500 uppercase tracking-widest">READY</span>
            <div className="flex gap-2">
              <span className={`w-4 h-4 rounded-full ${countdown <= 3 ? 'bg-red-500 shadow-lg shadow-red-500/50' : 'bg-red-950'} transition-all duration-300`} />
              <span className={`w-4 h-4 rounded-full ${countdown <= 2 ? 'bg-amber-500 shadow-lg shadow-amber-500/50' : 'bg-amber-950'} transition-all duration-300`} />
              <span className={`w-4 h-4 rounded-full ${countdown <= 1 ? 'bg-amber-500 shadow-lg shadow-amber-500/50' : 'bg-amber-950'} transition-all duration-300`} />
              <span className="w-4 h-4 rounded-full bg-emerald-950" />
            </div>
            <span className="text-lg font-black text-white w-6 text-center">{countdown}</span>
          </div>
        </div>
      )}

      {raceStatus === 'racing' && (
        <div className="flex flex-col items-center justify-center py-4 relative z-10 animate-fade-in">
          <div className="bg-emerald-500/20 px-6 py-2 rounded-2xl border border-emerald-500/30 flex items-center gap-4 animate-bounce-slow">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">GO! GO! GO!</span>
            <div className="flex gap-2">
              <span className="w-4 h-4 rounded-full bg-red-950" />
              <span className="w-4 h-4 rounded-full bg-amber-950" />
              <span className="w-4 h-4 rounded-full bg-amber-950" />
              <span className="w-4 h-4 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Track Asphalt */}
      <div className="relative bg-[#080b12] rounded-2xl p-4 md:p-6 overflow-hidden border border-white/5 shadow-inner">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 border-y border-dashed border-white/10" />
        
        {/* Finish Line Checkered Banner */}
        <div className="absolute right-[12%] inset-y-0 w-3 flex flex-col justify-between py-1 bg-white/5 select-none opacity-40">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`w-full h-2.5 ${i % 2 === 0 ? 'bg-white' : 'bg-black'}`} />
          ))}
        </div>

        {/* Lanes */}
        <div className="space-y-6 relative z-10">
          {/* Lane 1: Vehicle A */}
          <div className="relative h-12 flex items-center">
            <span className="absolute left-0 text-[8px] font-bold text-gray-600 uppercase tracking-wider">Lane 1</span>
            
            <div
              className="absolute flex items-center gap-2 transition-all duration-75 ease-out"
              style={{ left: `${Math.max(5, posA)}%` }}
            >
              <img
                src={vehicleA.image}
                alt={vehicleA.name}
                className="w-16 h-10 rounded-lg object-cover shadow-md border border-white/10 headlight-glow"
              />
              <div className="hidden sm:block bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] text-white whitespace-nowrap">
                {vehicleA.name}
              </div>
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Lane 2: Vehicle B */}
          <div className="relative h-12 flex items-center">
            <span className="absolute left-0 text-[8px] font-bold text-gray-600 uppercase tracking-wider">Lane 2</span>
            
            <div
              className="absolute flex items-center gap-2 transition-all duration-75 ease-out"
              style={{ left: `${Math.max(5, posB)}%` }}
            >
              <img
                src={vehicleB.image}
                alt={vehicleB.name}
                className="w-16 h-10 rounded-lg object-cover shadow-md border border-white/10 taillight-glow"
              />
              <div className="hidden sm:block bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[9px] text-white whitespace-nowrap">
                {vehicleB.name}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Winner Verdict */}
      {raceStatus === 'finished' && winner && (
        <div className="mt-6 p-5 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 animate-slide-up flex flex-col sm:flex-row items-center gap-4 relative z-10">
          <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0 animate-bounce-slow">
            <Trophy className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
              Verdict: {winner.name} Wins!
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              {verdict}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  const { comparisonList, addToCompare, clearComparison, allVehicles } = useVehicle();
  const [showSelector, setShowSelector] = useState(false);
  const [selectorSearch, setSelectorSearch] = useState('');

  const filteredForSelector = allVehicles.filter(v => {
    const q = selectorSearch.toLowerCase();
    return (
      !comparisonList.find(cv => cv.id === v.id) &&
      (v.name.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
              <GitCompare className="w-5 h-5 text-primary-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-display text-white">
              Compare Vehicles
            </h1>
          </div>
          <p className="text-gray-400">
            Compare vehicles side-by-side to find the perfect match
          </p>
        </div>

        {/* Comparison Content */}
        {comparisonList.length > 0 ? (
          <div className="space-y-6">
            {/* Add Vehicle Button */}
            {comparisonList.length < 2 && (
              <div className="flex justify-end">
                <button
                  onClick={() => setShowSelector(true)}
                  className="btn-gradient flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Vehicle to Compare
                </button>
              </div>
            )}

            {/* Comparison Table */}
            <ComparisonTable />

            {/* Drag Strip Simulator mini-game */}
            {comparisonList.length === 2 && (
              <DragStripSimulation vehicleA={comparisonList[0]} vehicleB={comparisonList[1]} />
            )}

            {/* Verdict Section */}
            {comparisonList.length === 2 && (
              <div className="glass-card p-6 sm:p-8">
                <h3 className="text-xl font-bold text-white mb-4 font-display">
                  Quick <span className="gradient-text">Verdict</span>
                </h3>
                <div className="grid sm:grid-cols-2 gap-6">
                  {comparisonList.map((vehicle) => (
                    <div key={vehicle.id} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={vehicle.image}
                          alt={vehicle.name}
                          className="w-16 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="font-bold text-white">{vehicle.name}</h4>
                          <p className="text-xs text-gray-500">{vehicle.brand}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {/* Price comparison bar */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500">Price</span>
                            <span className="text-green-400">{vehicle.priceFormatted}</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min(
                                  (vehicle.price /
                                    Math.max(...comparisonList.map(v => v.price))) *
                                    100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                        {/* Mileage bar */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500">Mileage</span>
                            <span className="text-blue-400">{vehicle.mileage}</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min(
                                  (vehicle.mileageValue /
                                    Math.max(...comparisonList.map(v => v.mileageValue))) *
                                    100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                        {/* Rating bar */}
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500">Rating</span>
                            <span className="text-yellow-400">★ {vehicle.rating}/5</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all duration-500"
                              style={{
                                width: `${(vehicle.rating / 5) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="glass-card p-12 sm:p-16 text-center">
            <div className="w-20 h-20 rounded-3xl bg-primary-500/10 flex items-center justify-center mx-auto mb-6">
              <GitCompare className="w-10 h-10 text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 font-display">
              No Vehicles to Compare
            </h2>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              Add vehicles to your comparison list from the vehicle listings or detail pages. 
              You can compare up to 2 vehicles at a time.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setShowSelector(true)}
                className="btn-gradient flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Select Vehicles
              </button>
              <Link to="/cars" className="btn-outline flex items-center gap-2">
                <Car className="w-4 h-4" />
                Browse Cars
              </Link>
              <Link to="/bikes" className="btn-outline flex items-center gap-2">
                <Bike className="w-4 h-4" />
                Browse Bikes
              </Link>
            </div>
          </div>
        )}

        {/* Vehicle Selector Modal */}
        {showSelector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowSelector(false)}
            />
            <div className="relative w-full max-w-lg bg-dark-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
              {/* Modal Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Select a Vehicle</h3>
                <button
                  onClick={() => setShowSelector(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                  <Search className="w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={selectorSearch}
                    onChange={(e) => setSelectorSearch(e.target.value)}
                    placeholder="Search vehicles..."
                    className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>

              {/* Vehicle List */}
              <div className="max-h-80 overflow-y-auto p-2">
                {filteredForSelector.length > 0 ? (
                  filteredForSelector.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      onClick={() => {
                        addToCompare(vehicle);
                        setShowSelector(false);
                        setSelectorSearch('');
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-200 text-left"
                    >
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-14 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{vehicle.name}</p>
                        <p className="text-xs text-gray-500">
                          {vehicle.brand} • {vehicle.priceFormatted} • {vehicle.engine}
                        </p>
                      </div>
                      {vehicle.type === 'car' ? (
                        <Car className="w-4 h-4 text-primary-400" />
                      ) : (
                        <Bike className="w-4 h-4 text-accent-400" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    No vehicles found
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
