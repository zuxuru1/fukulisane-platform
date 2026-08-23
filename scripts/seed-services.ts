const BIZ_ID = 'cmrxdyv8g0001pujgayucxbfn'
const API = 'http://127.0.0.1:3001/api'

const services = [
  // Residential Construction
  { name: 'New House Construction', description: 'Complete new home builds from foundation to finish. Custom designs to fit your budget and lifestyle.', category: 'Residential Construction' },
  { name: 'Foundations', description: 'Professional foundation work for new builds and extensions. Strip foundations, raft slabs, and piling.', category: 'Residential Construction' },
  { name: 'Brickwork', description: 'Expert bricklaying for walls, structures, and decorative features. Face brick, plaster bricks, and concrete blocks.', category: 'Residential Construction' },
  { name: 'Roofing', description: 'New roof installation, repairs, and waterproofing. Tiled, corrugated, and flat roof systems.', category: 'Residential Construction' },
  { name: 'Concrete Slabs', description: 'Professional concrete slab pouring for floors, driveways, and foundations.', category: 'Residential Construction' },
  { name: 'Boundary Walls', description: 'Security boundary walls and fencing. Pre-cast, brick, palisade, and electric fencing options.', category: 'Residential Construction' },
  { name: 'Garages', description: 'Single and double garage construction. Attached and standalone designs with automated doors.', category: 'Residential Construction' },
  { name: 'Carports', description: 'Covered parking structures. Steel, timber, and shade net designs to protect your vehicles.', category: 'Residential Construction' },
  // Home Renovations
  { name: 'House Extensions', description: 'Add rooms, extend living space, or add a second storey. Seamless integration with existing structure.', category: 'Home Renovations' },
  { name: 'Kitchen Renovations', description: 'Modern kitchen makeovers. New cupboards, countertops, plumbing, tiling, and electrical work.', category: 'Home Renovations' },
  { name: 'Bathroom Renovations', description: 'Complete bathroom upgrades. Waterproofing, tiling, fixtures, vanities, and plumbing.', category: 'Home Renovations' },
  { name: 'Ceiling Installation', description: 'Plaster, PVC, gypsum, and suspended ceiling installation. Insulation options available.', category: 'Home Renovations' },
  { name: 'Drywall Partitioning', description: 'Interior wall partitioning for offices and homes. Plasterboard and stud wall systems.', category: 'Home Renovations' },
  { name: 'Flooring and Tiling', description: 'Floor and wall tiling, laminate, vinyl, and ceramic installations. All room types.', category: 'Home Renovations' },
  { name: 'Painting', description: 'Interior and exterior painting. Professional finishes, colour consultation, and preparation.', category: 'Home Renovations' },
  { name: 'Plastering', description: 'Internal and external plastering. Smooth, textured, and decorative finishes.', category: 'Home Renovations' },
  // General Construction
  { name: 'Paving', description: 'Driveways, walkways, patios, and outdoor areas. Brick, concrete, and natural stone options.', category: 'General Construction' },
  { name: 'Retaining Walls', description: 'Structural retaining walls for sloped properties. Concrete, stone, and gabion systems.', category: 'General Construction' },
  { name: 'Driveways', description: 'New driveway construction and resurfacing. Gravel, tar, paving, and concrete finishes.', category: 'General Construction' },
  { name: 'Boundary Fencing', description: 'Timber, steel, PVC, and wire fencing. Installation and repairs.', category: 'General Construction' },
  { name: 'Commercial Projects', description: 'Small commercial building projects. Office fit-outs, shop renovations, and retail spaces.', category: 'General Construction' },
  { name: 'Property Maintenance', description: 'Regular property upkeep, repairs, and small fixes. Keep your property in top condition.', category: 'General Construction' },
]

async function main() {
  // Delete all existing
  const list = await fetch(`${API}/services?businessId=${BIZ_ID}`).then(r => r.json())
  const items = Array.isArray(list) ? list : list.items ?? []
  for (const s of items) {
    await fetch(`${API}/services/${s.id}`, { method: 'DELETE' })
  }
  console.log(`Deleted ${items.length} old services`)

  // Create new
  for (const s of services) {
    await fetch(`${API}/services`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId: BIZ_ID, ...s }),
    })
  }
  console.log(`Created ${services.length} services from business plan`)

  // Verify
  const check = await fetch(`${API}/services?businessId=${BIZ_ID}`).then(r => r.json())
  const verify = Array.isArray(check) ? check : check.items ?? []
  const cats = {}
  for (const s of verify) {
    const cat = s.category || 'Uncategorized'
    if (!cats[cat]) cats[cat] = []
    cats[cat].push(s.name)
  }
  console.log(`\nTotal: ${verify.length} services`)
  for (const [cat, names] of Object.entries(cats)) {
    console.log(`\n  ${cat} (${names.length}):`)
    for (const n of names) console.log(`    ✓ ${n}`)
  }
}

main().catch(console.error)
