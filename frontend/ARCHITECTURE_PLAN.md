# AETHER - System Architecture & Feature Planning

## 1. Complete Required Page List

### A. Public Storefront (User Entering System)
| Page Name | Purpose | Key Components | SOP/System Support |
| :--- | :--- | :--- | :--- |
| **Landing / Home** | Brand introduction & Category entry | `Hero`, `CategoryList`, `LiveSessionPrompt` | Entry point for traffic |
| **Product Listing (PLP)** | Browsing catalog with filters | `FilterSidebar`, `ProductCard`, `CoBrowsingInvite` | Base for browsing |
| **Product Detail (PDP)** | Detailed view & Action center | `ImageGallery`, `SizeSelector`, `SmartAutoPurchaseWidget`, `TryBeforeBuyBtn` | **Smart Auto-Purchase**, **Try-Before-Buy** |
| **Checkout** | Finalize purchase | `AddressForm`, `PaymentGateway`, `EscrowConsent` | **Privacy Rule (SOP 02)** |

### B. User Dashboard (Authenticated)
| Page Name | Purpose | Key Components | SOP/System Support |
| :--- | :--- | :--- | :--- |
| **My Wallet** | Manage funds & trials | `BalanceDisplay`, `FrozenFundsIndicator`, `TransactionHistory` | **Try-Before-Buy Escrow** |
| **Order History** | Track lifecycle of orders | `OrderList`, `ReturnInitiation`, `TrialCountdown` | Tracking trial expiry |
| **Profile / Settings** | User PII management | `ProfileForm`, `SecuritySettings` | **Privacy Rule (SOP 02)** |

### C. Social & Interactive
| Page Name | Purpose | Key Components | SOP/System Support |
| :--- | :--- | :--- | :--- |
| **Co-Browsing Lobby** | Waiting area for sessions | `SessionCodeInput`, `PermissionGrant` | **Co-Browsing** |
| **Active Session View** | Shared browsing interface | `SharedBrowserViewport`, `ChatSidebar`, `PrivacyOverlay` | **Co-Browsing (SOP 02)** |

### D. Admin Platform (Internal)
| Page Name | Purpose | Key Components | SOP/System Support |
| :--- | :--- | :--- | :--- |
| **Dispute Resolution** | Handle return conflicts | `DisputeQueue`, `SplitViewComparison`, `DecisionControls` | **Return Dispute (SOP 01)** |
| **Inventory & Price** | Manage stock & pricing | `PriceInjector`, `StockLevelMonitor` | Triggers Auto-Purchase events |

---

## 2. Smart / AI Feature Logic

### A. Smart Auto-Purchase Engine

**1. Data Structure (Target)**
Each user-product pair has a `PurchaseTarget` record:
```json
{
  "userId": "u123",
  "productId": "p999",
  "targetPrice": 4500,
  "status": "ACTIVE", // or PAUSED
  "consentToken": "signed_token_xyz" // Proof of pre-authorization
}
```

**2. Price Check Trigger Mechanism**
*   **Event-Driven**: When the Admin/Inventory system updates a product price, it emits a `PRICE_UPDATE` event to the message queue (Kafka/RabbitMQ).
*   **Engine Subscriber**: The Auto-Purchase Service listens to `PRICE_UPDATE`.
*   **Evaluation**:
    *   Find all efficient `PurchaseTarget` records where `targetPrice >= newPrice`.

**3. Execution Logic & Validation**
For every matching target:
1.  **Wallet Check**: Fetch User Wallet.
2.  **Condition**: `IF (Wallet.availableBalance >= newPrice)`:
    *   **Lock Funds**: Move amount to `Locked` state immediately.
    *   **Create Order**: Generate Order ID.
    *   **Notify**: Send email/SMS "Deal Snagged!".
    *   **Deactivate**: Set Target status to `FULFILLED`.
3.  **Failure (Insufficient Funds)**:
    *   **Action**: Skip purchase.
    *   **Notify**: "Missed Deal due to low balance."

### B. Social Co-Browsing Synchronization

**1. Authority Model**
*   **Host**: The "Driver". Only their navigation/scroll events are broadcasted as "Commands".
*   **Guest**: The "Passenger". Their client listens for commands and replicates state. They cannot steer (unless "Pass Control" is implemented).

**2. Sync Logic**
*   **Navigation**: Host URL change -> Socket Event `NAVIGATE_TO(url)` -> Guests `history.push(url)`.
*   **Scroll**: Host scroll -> Throttle(100ms) -> Socket Event `SCROLL_Y(pos)` -> Guests `window.scrollTo`.

**3. Privacy Enforcement (SOP 02)**
*   **Sensitive Routes Registry**: `['/checkout', '/profile', '/wallet', '/settings']`
*   **Host Action**: Host navigates to `/checkout`.
*   **Broadcast**: Socket sends `NAVIGATE_TO('/checkout')`.
*   **Guest Client Logic**:
    *   Receives route `/checkout`.
    *   Checks Registry: **MATCH FOUND**.
    *   **Action**:
        1.  Navigate guest to `/checkout`.
        2.  **IMMEDIATELY** Mount `<PrivacyOverlay />` on top of the viewport.
        3.  Blur backdrop content.
        4.  Display "Private Action in Progress".
*   **Resume**: Host navigates to `/home`. Guest removes Overlay.

**4. Disconnect Handling**
*   If Host disconnects: Session pauses ("Host is away").
*   If Guest disconnects: Session continues for Host; Guest can reconnect via `session_id`.
