import numpy as np
from pandas import Timestamp

class SerializationMixin:
    def _json_safe(self, obj):
        """Recursively convert numpy/pandas types to native Python for JSON serialization."""
        if isinstance(obj, (str, int, float, bool)) or obj is None:
            return obj
        if isinstance(obj, (np.bool_, )):
            return bool(obj)
        if isinstance(obj, (np.integer, )):
            return int(obj)
        if isinstance(obj, (np.floating, )):
            return float(obj)
        if isinstance(obj, Timestamp):
            return obj.isoformat()
        if isinstance(obj, dict):
            return {str(self._json_safe(k)): self._json_safe(v) for k, v in obj.items()}
        if isinstance(obj, (list, tuple, set)):
            return [self._json_safe(v) for v in obj]
        try:
            if isinstance(obj, (np.dtype,)):
                return str(obj)
        except Exception:
            pass
        return str(obj)
