package sentinelgroup.io.sentinel.db;

import android.arch.persistence.room.Dao;
import android.arch.persistence.room.Insert;
import android.arch.persistence.room.OnConflictStrategy;
import android.arch.persistence.room.Query;

@Dao
public interface PinEntryDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertPinEntity(PinEntity iEntity);

    @Query("SELECT * FROM pin_entity WHERE accountAddress = :iAccountAddress")
    PinEntity getPinEntity(String iAccountAddress);

    @Query("UPDATE pin_entity SET appPin = :iPin WHERE accountAddress = :iAccountAddress")
    void updatePin(int iPin, String iAccountAddress);

    @Query("DELETE FROM pin_entity")
    void deletePin();
}