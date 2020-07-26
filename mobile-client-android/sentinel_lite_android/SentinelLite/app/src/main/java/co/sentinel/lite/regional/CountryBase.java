package co.sentinel.lite.regional;

/**
 * CountryBase
 * <p>Base class for the Country. It holds the essentials of a country </p>
 */
class CountryBase {
    private final String id;        // The country's ISO 3166-1 numeric id
    private final String name;        // The official name of the country
    private final String alpha2;    // The country's ISO 3166 alpha2 id
    private final String alpha3;    // The country's ISO 3166 alpha3 id

    /**
     * Create a country with the name, iso alpha2, alpha3 and flag
     *
     * @param id The numeric code of the country
     * @param name The name of the country
     * @param alpha2 The country's ISO 3166 alpha2 id
     * @param alpha3 The country's ISO 3166 alpha3 id
     */
    CountryBase(
            final String id, final String name, final String alpha2, final String alpha3) {
        this.id = id;
        this.name = name;
        this.alpha2 = alpha2;
        this.alpha3 = alpha3;
    }

    /**
     * Get the name of the country
     *
     * @return The country name
     */
    public final String getName() {
        return name;
    }

    /**
     * Get the alpha2 of the country
     *
     * @return The ISO 3166 alpha2 id of the country
     */
    public final String getAlpha2() {
        return alpha2;
    }

    /**
     * Get the alpha3 of the country
     *
     * @return The ISO 3166 alpha3 id of the country
     */
    public final String getAlpha3() {
        return alpha3;
    }

    /**
     * Get the ISO 3166-1 numeric code of the country
     *
     * @return The ISO 3166-1 numeric code of the country
     */
    public final String getId() {
        return id;
    }

    /**
     * Determine if an identifier is part of a country
     *
     * @param identifier The identifier {id|alpha2|alpha3|name}
     *
     * @return True if the identifier is part of this Country
     */
    final boolean hasIdentifier(final String identifier) {
        return name.equalsIgnoreCase(identifier) || alpha2.equalsIgnoreCase(identifier) || alpha3
                .equalsIgnoreCase(identifier) || id.equalsIgnoreCase(identifier);
    }

    @Override
    public String toString() {
        final StringBuffer sb = new StringBuffer("CountryBase{");
        sb.append("id='").append(id).append('\'');
        sb.append(", name='").append(name).append('\'');
        sb.append(", alpha2='").append(alpha2).append('\'');
        sb.append(", alpha3='").append(alpha3).append('\'');
        sb.append('}');
        return sb.toString();
    }
}
