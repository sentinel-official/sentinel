package sentinelgroup.io.sentinel.db;

import android.arch.persistence.room.Dao;
import android.arch.persistence.room.Insert;
import android.arch.persistence.room.OnConflictStrategy;
import android.arch.persistence.room.Query;

@Dao
public interface PinEntryDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    long insertPinEntity(PinEntity iEntity);

    @Query("SELECT Count(*) FROM pin_entity WHERE appPin = :iPin AND accountAddress = :iAccountAddress")
    int getPinEntity(int iPin, String iAccountAddress);

    @Query("UPDATE pin_entity SET appPin = :iNewPin WHERE appPin = :iOldPin AND accountAddress = :iAccountAddress")
    int updatePin(int iOldPin, int iNewPin, String iAccountAddress);

    @Query("UPDATE pin_entity SET appPin = :iNewPin WHERE accountAddress = :iAccountAddress")
    int updatePin(int iNewPin, String iAccountAddress);

    @Query("DELETE FROM pin_entity")
    void deletePin();
}