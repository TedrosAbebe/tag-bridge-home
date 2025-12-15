const Database = require('better-sqlite3');
const { join } = require('path');

const dbPath = join(process.cwd(), 'data', 'broker.db');
const db = new Database(dbPath);

console.log('🗑️ Deleting all test home listings...');

try {
  // First, check what we have
  const propertiesCount = db.prepare('SELECT COUNT(*) as count FROM properties').get();
  console.log('📊 Current properties in main table:', propertiesCount.count);

  let advertiserCount = 0;
  try {
    const advProps = db.prepare('SELECT COUNT(*) as count FROM advertiser_properties').get();
    advertiserCount = advProps.count;
    console.log('📢 Current advertiser properties:', advertiserCount);
  } catch (error) {
    console.log('📢 No advertiser properties table found');
  }

  // Delete all related records first to avoid foreign key issues
  console.log('\n🧹 Cleaning up related records...');
  
  try {
    const paymentsDeleted = db.prepare('DELETE FROM payments').run();
    console.log('💳 Deleted payments:', paymentsDeleted.changes);
  } catch (error) {
    console.log('💳 No payments table or no payments to delete');
  }

  try {
    const favoritesDeleted = db.prepare('DELETE FROM favorites').run();
    console.log('❤️ Deleted favorites:', favoritesDeleted.changes);
  } catch (error) {
    console.log('❤️ No favorites table or no favorites to delete');
  }

  try {
    const imagesDeleted = db.prepare('DELETE FROM property_images').run();
    console.log('🖼️ Deleted property images:', imagesDeleted.changes);
  } catch (error) {
    console.log('🖼️ No property_images table or no images to delete');
  }

  try {
    const guestSubmissionsDeleted = db.prepare('DELETE FROM guest_submissions').run();
    console.log('👥 Deleted guest submissions:', guestSubmissionsDeleted.changes);
  } catch (error) {
    console.log('👥 No guest_submissions table or no submissions to delete');
  }

  // Delete all properties from main properties table
  console.log('\n🏠 Deleting main properties...');
  const mainPropertiesDeleted = db.prepare('DELETE FROM properties').run();
  console.log('✅ Deleted main properties:', mainPropertiesDeleted.changes);

  // Delete all advertiser properties
  console.log('\n📢 Deleting advertiser properties...');
  try {
    const advertiserPropertiesDeleted = db.prepare('DELETE FROM advertiser_properties').run();
    console.log('✅ Deleted advertiser properties:', advertiserPropertiesDeleted.changes);
  } catch (error) {
    console.log('📢 No advertiser_properties table found');
  }

  // Verify deletion
  console.log('\n🔍 Verifying deletion...');
  const finalPropertiesCount = db.prepare('SELECT COUNT(*) as count FROM properties').get();
  console.log('📊 Remaining properties in main table:', finalPropertiesCount.count);

  try {
    const finalAdvCount = db.prepare('SELECT COUNT(*) as count FROM advertiser_properties').get();
    console.log('📢 Remaining advertiser properties:', finalAdvCount.count);
  } catch (error) {
    console.log('📢 Advertiser properties table not found');
  }

  console.log('\n🎉 SUCCESS! All test home listings have been deleted!');
  console.log('📋 Summary:');
  console.log(`   • Main properties deleted: ${mainPropertiesDeleted.changes}`);
  console.log(`   • Advertiser properties deleted: ${advertiserCount}`);
  console.log('   • All related records cleaned up');
  console.log('\n✨ The database is now clean and ready for fresh listings!');

} catch (error) {
  console.error('❌ Error deleting properties:', error.message);
} finally {
  db.close();
}