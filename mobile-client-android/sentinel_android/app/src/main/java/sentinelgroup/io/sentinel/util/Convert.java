package sentinelgroup.io.sentinel.util;

import java.math.BigDecimal;
import java.math.BigInteger;

/**
 * Ethereum unit conversion functions.
 */
public final class Convert {
    private Convert() {
    }

    public static BigInteger fromWei(String number, Unit unit) {
        return fromWei(new BigDecimal(number), unit);
    }

    public static BigInteger fromWei(BigDecimal number, Unit unit) {
        return number.divide(unit.getWeiFactor()).toBigInteger();
    }

    public static BigInteger toWei(String number, Unit unit) {
        return toWei(new BigDecimal(number), unit);
    }

    public static BigInteger toWei(BigDecimal number, Unit unit) {
        return number.multiply(unit.getWeiFactor()).toBigInteger();
    }

    public enum Unit {
        WEI("wei", 0),
        KWEI("kwei", 3),
        MWEI("mwei", 6),
        GWEI("gwei", 9),
        SZABO("szabo", 12),
        FINNEY("finney", 15),
        ETHER("ether", 18),
        KETHER("kether", 21),
        METHER("mether", 24),
        GETHER("gether", 27);

        private String name;
        private BigDecimal weiFactor;

        Unit(String name, int factor) {
            this.name = name;
            this.weiFactor = BigDecimal.TEN.pow(factor);
        }

        public BigDecimal getWeiFactor() {
            return weiFactor;
        }

        @Override
        public String toString() {
            return name;
        }

        public static Unit fromString(String name) {
            if (name != null) {
                for (Unit unit : Unit.values()) {
                    if (name.equalsIgnoreCase(unit.name)) {
                        return unit;
                    }
                }
            }
            return Unit.valueOf(name);
        }
    }
}
