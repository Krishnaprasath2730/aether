# Aether Architecture & Feature Planning

## 1. Required Pages Structure
Based on the SOPs and "Try-Before-Buy" / "Co-Browsing" models, here is the recommended page structure:

*   **Public Storefront**:
    *   `Home` (Landing, Categories)
    *   `ProductListing` (PLP - Filter & Sort)
    *   `ProductDetail` (PDP - Smart Auto-Purchase Trigger here)
    *   `Cart` & `Checkout` (Standard)

*   **User Dashboard**:
    *   `Wallet` (Critical for Try-Before-Buy: Shows Available vs. Frozen funds)
    *   `Orders` (Track Status: "On Trial", "Kept", "Returned")
    *   `Profile` (Sensitive Route - triggers Privacy Overlay in Co-Browsing)

*   **Social Shopping**:
    *   `CoBrowsingSession` (The "Shared Room" interface)
    *   `WaitingRoom` (Lobby for guests)

*   **Admin Platform**:
    *   `DisputeResolution` (SOP 01: Side-by-side image comparison)
    *   `InventoryManager`

## 2. Smart & AI Feature Logic

### A. Smart Auto-Purchase Engine
**Goal**: Automate purchasing when price hits a target.
**Logic**:
1.  **User Input**: User sets `Target Price` ($50) on a Product ($80).
2.  **Trigger**: Toggle "Auto-Buy" to `ON`.
3.  **Backend Process**:
    *   Scheduled Job (Cron) or Stream watches price changes.
    *   `IF (NewPrice <= TargetPrice) AND (WalletBalance >= NewPrice)`:
        *   **Action**: Execute Transaction immediately.
        *   **Notification**: "Item purchased at $49! (Saved $31)".
4.  **Frontend State**: Needs to reflect "Active Monitoring" status on the button.

### B. Social Co-Browsing Synchronization
**Goal**: Real-time shared view while protecting privacy.
**Logic**:
1.  **Transport**: WebSocket (Socket.io) to sync state `room_id`.
2.  **Shared State Objects**:
    *   `Navigate(url)`: Host changes route -> Guests redirected.
    *   `Scroll(y)`: Host scrolls -> Guest window scrolls (smooth).
    *   `Action(click)`: Highlights interactions.
3.  **Privacy/Security (SOP 02)**:
    *   **Middleware/Guard**:
        ```typescript
        const SENSITIVE_ROUTES = ['/checkout', '/user/profile', '/wallet'];
        if (SENSITIVE_ROUTES.includes(location.pathname)) {
            socket.emit('privacy_lock', { active: true });
        }
        ```
    *   **Guest Client**:
        *   Listens for `privacy_lock`.
        *   If `true`: Render `<PrivacyOverlay />` (Blur screen).
        *   If `false`: Remove overlay, resume sync.
