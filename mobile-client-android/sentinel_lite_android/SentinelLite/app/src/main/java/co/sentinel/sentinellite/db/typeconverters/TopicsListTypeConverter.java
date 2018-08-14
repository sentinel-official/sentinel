package co.sentinel.sentinellite.db.typeconverters;

import android.arch.persistence.room.TypeConverter;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.Collections;
import java.util.List;

/**
 * TypeConverter to store a List of Strings in the database.
 */
public class TopicsListTypeConverter {
    private static Gson gson = new Gson();

    @TypeConverter
    public static List<String> stringToObjectList(String data) {
        if (data == null) {
            return Collections.emptyList();
        }

        Type listType = new TypeToken<List<String>>() {
        }.getType();

        return gson.fromJson(data, listType);
    }

    @TypeConverter
    public static String objectListToString(List<String> someObjects) {
        return gson.toJson(someObjects);
    }
}