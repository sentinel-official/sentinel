package co.sentinel.sentinellite.db.dao;

import android.arch.persistence.room.Dao;
import android.arch.persistence.room.Insert;
import android.arch.persistence.room.OnConflictStrategy;
import android.arch.persistence.room.Query;

import java.util.List;

import co.sentinel.sentinellite.network.model.BookmarkEntity;


@Dao
public interface BookmarkDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insertBookmarkEntity(BookmarkEntity iBookmarkEntity);

    @Query("SELECT COUNT(*) FROM bookmark_entity WHERE accountAddress = :iAccountAddress AND ip = :iIP")
    int getBookmarkEntity(String iAccountAddress, String iIP);

    @Query("SELECT * FROM bookmark_entity")
    List<BookmarkEntity> getAllBookmarkEntities();

    @Query("DELETE FROM bookmark_entity WHERE accountAddress = :iAccountAddress AND ip = :iIP")
    void deleteBookmarkEntity(String iAccountAddress, String iIP);
}
