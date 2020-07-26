package co.sentinel.lite.db.typeconverters;

import android.arch.persistence.room.TypeConverter;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.Collections;
import java.util.List;

import co.sentinel.lite.network.model.Session;

/**
 * TypeConverter to store a custom object (List<Session>) in the database.
 */
public class SessionListTypeConverter {
    private static Gson gson = new Gson();

    @TypeConverter
    public static List<Session> stringToObjectList(String data) {
        if (data == null) {
            return Collections.emptyList();
        }

        Type listType = new TypeToken<List<Session>>() {
        }.getType();

        return gson.fromJson(data, listType);
    }

    @TypeConverter
    public static String objectListToString(List<Session> someObjects) {
        return gson.toJson(someObjects);
    }
}