package plugin

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/grafana/grafana-plugin-sdk-go/backend/log"
)

// handlePing is an example HTTP GET resource that returns a {"message": "ok"} JSON response.
func (a *App) handlePing(w http.ResponseWriter, req *http.Request) {
	w.Header().Add("Content-Type", "application/json")
	if _, err := w.Write([]byte(`{"message": "ok"}`)); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

// handleEcho is an example HTTP POST resource that accepts a JSON with a "message" key and
// returns to the client whatever it is sent.
func (a *App) handleEcho(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var body struct {
		Message string `json:"message"`
	}
	if err := json.NewDecoder(req.Body).Decode(&body); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.Header().Add("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(body); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (a *App) handleConfigTenant(w http.ResponseWriter, req *http.Request) {

	rootUrl := os.Getenv("GF_PLUGIN_TENANT_ROOT_URL")
	userName := os.Getenv("GF_PLUGIN_TENANT_USER_NAME")
	userPassWord := os.Getenv("GF_PLUGIN_TENANT_USER_PASSWORD")

	data := make(map[string]interface{}, 3)
	data["rootUrl"] = rootUrl
	data["userName"] = userName
	data["userPassWord"] = userPassWord

	buf, err := json.Marshal(data)

	if err != nil {
		err.Error()
	}

	w.Header().Add("Content-Type", "application/json")
	if _, err := w.Write([]byte(buf)); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	log.DefaultLogger.Info("Load custom tenant plugin configuration")
	w.WriteHeader(http.StatusOK)
}

// registerRoutes takes a *http.ServeMux and registers some HTTP handlers.
func (a *App) registerRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/ping", a.handlePing)
	mux.HandleFunc("/echo", a.handleEcho)
	mux.HandleFunc("/tenants/configs", a.handleConfigTenant)
}
