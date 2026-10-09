package com.Hypermarketplace.backend;

import com.Hypermarketplace.backend.dto.*;
import com.Hypermarketplace.backend.model.*;
import com.Hypermarketplace.backend.repository.*;
import com.Hypermarketplace.backend.service.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class IntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        // Clean all collections before each test run
        userRepository.deleteAll();
        providerRepository.deleteAll();
        categoryRepository.deleteAll();
        serviceRepository.deleteAll();
        scheduleRepository.deleteAll();
        bookingRepository.deleteAll();
        addressRepository.deleteAll();
        paymentRepository.deleteAll();
        reviewRepository.deleteAll();
        notificationRepository.deleteAll();
        invoiceRepository.deleteAll();
    }

    private User createTestUser(String name, String email, String role) {
        User user = new User(name, email, "encodedPassword", role);
        return userRepository.save(user);
    }

    private String createBearerToken(User user) {
        return "Bearer " + jwtService.generateToken(user);
    }

    // ==========================================
    // 1. USER & AUTH MODULE
    // ==========================================

    @Test
    void testUserRegistrationAndLogin_HappyAndFailurePath() throws Exception {
        // Happy path: register
        UserRequest regReq = new UserRequest();
        regReq.setName("Alice");
        regReq.setEmail("alice@test.com");
        regReq.setPassword("Password123");

        mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("alice@test.com"))
                .andExpect(jsonPath("$.role").value("CUSTOMER"));

        // Failure path: duplicate email registration
        mockMvc.perform(post("/api/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regReq)))
                .andExpect(status().isInternalServerError());

        // Happy path: login
        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail("alice@test.com");
        loginReq.setPassword("Password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty());

        // Failure path: invalid password login
        loginReq.setPassword("WrongPass");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isInternalServerError());
    }

    // ==========================================
    // 2. PROVIDER MODULE & REGRESSION TEST
    // ==========================================

    @Test
    void testProviderCreation_RegressionUserIdCheck() throws Exception {
        User providerUser = createTestUser("Bob Provider", "bob@provider.com", "PROVIDER");
        String token = createBearerToken(providerUser);

        ProviderRequest req = new ProviderRequest();
        req.setBusinessName("Bob Electrics");
        req.setDescription("All electric repairs");
        req.setPhone("9876543210");
        req.setExperience("5");
        req.setAddress("123 Street");

        // Happy path
        mockMvc.perform(post("/api/providers")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.businessName").value("Bob Electrics"))
                .andExpect(jsonPath("$.verified").value(false));

        // REGRESSION VERIFICATION: Provider.userId must be Mongo _id, NOT email
        Provider savedProvider = providerRepository.findByUserId(providerUser.getId()).orElse(null);
        assertNotNull(savedProvider, "Provider should exist by User Mongo _id");
        assertEquals(providerUser.getId(), savedProvider.getUserId(), "Provider.userId MUST equal user.getId()");
        assertNotEquals("bob@provider.com", savedProvider.getUserId(), "Provider.userId must NOT be user's email");

        // Failure path: duplicate profile creation
        mockMvc.perform(post("/api/providers")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isConflict());
    }

    // ==========================================
    // 3. CATEGORY MODULE
    // ==========================================

    @Test
    void testCategory_AdminOnlyAndDuplicateCheck() throws Exception {
        User admin = createTestUser("Admin", "admin@cat.com", "ADMIN");
        User customer = createTestUser("Cust", "cust@cat.com", "CUSTOMER");

        CategoryRequest req = new CategoryRequest();
        req.setName("Plumbing");
        req.setDescription("Pipe fixes");

        // Failure path: non-admin gets 403
        mockMvc.perform(post("/api/categories")
                        .header("Authorization", createBearerToken(customer))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isForbidden());

        // Happy path: admin creates
        mockMvc.perform(post("/api/categories")
                        .header("Authorization", createBearerToken(admin))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Plumbing"));

        // Failure path: duplicate category name returns 409
        mockMvc.perform(post("/api/categories")
                        .header("Authorization", createBearerToken(admin))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isConflict());
    }

    // ==========================================
    // 4. SERVICE MODULE
    // ==========================================

    @Test
    void testService_CreateAndSoftDelete() throws Exception {
        User providerUser = createTestUser("Dave", "dave@prov.com", "PROVIDER");
        Provider provider = new Provider();
        provider.setUserId(providerUser.getId());
        provider.setBusinessName("Dave Services");
        provider = providerRepository.save(provider);

        Category cat = new Category();
        cat.setName("Cleaning");
        cat.setActive(true);
        cat = categoryRepository.save(cat);

        ServiceRequest sReq = new ServiceRequest();
        sReq.setCategoryId(cat.getId());
        sReq.setTitle("Home Cleaning");
        sReq.setDescription("Deep cleaning");
        sReq.setPrice(500.0);
        sReq.setDurationMinutes(60);

        // Happy path
        String res = mockMvc.perform(post("/api/services")
                        .header("Authorization", createBearerToken(providerUser))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Home Cleaning"))
                .andReturn().getResponse().getContentAsString();

        ServiceResponse sResp = objectMapper.readValue(res, ServiceResponse.class);

        // Failure path: delete with unauthorized user
        User otherProvider = createTestUser("Sam", "sam@prov.com", "PROVIDER");
        Provider otherP = new Provider();
        otherP.setUserId(otherProvider.getId());
        providerRepository.save(otherP);

        mockMvc.perform(delete("/api/services/" + sResp.getId())
                        .header("Authorization", createBearerToken(otherProvider)))
                .andExpect(status().isNotFound());

        // Happy path: delete with owning provider
        mockMvc.perform(delete("/api/services/" + sResp.getId())
                        .header("Authorization", createBearerToken(providerUser)))
                .andExpect(status().isOk());
    }

    // ==========================================
    // 5. SCHEDULE MODULE
    // ==========================================

    @Test
    void testSchedule_CreateAndUpdate() throws Exception {
        User providerUser = createTestUser("John", "john@prov.com", "PROVIDER");
        Provider provider = new Provider();
        provider.setUserId(providerUser.getId());
        provider = providerRepository.save(provider);

        String happyScheduleJson = """
                {
                    "dayOfWeek": "MONDAY",
                    "startTime": "09:00:00",
                    "endTime": "17:00:00",
                    "available": true
                }
                """;

        // Happy path
        mockMvc.perform(post("/api/providers/me/schedule")
                        .header("Authorization", createBearerToken(providerUser))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(happyScheduleJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dayOfWeek").value("MONDAY"));

        // Failure path: startTime after endTime
        String invalidScheduleJson = """
                {
                    "dayOfWeek": "MONDAY",
                    "startTime": "18:00:00",
                    "endTime": "09:00:00",
                    "available": true
                }
                """;
        mockMvc.perform(post("/api/providers/me/schedule")
                        .header("Authorization", createBearerToken(providerUser))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidScheduleJson))
                .andExpect(status().isConflict());
    }

    // ==========================================
    // 6. ADDRESS MODULE
    // ==========================================

    @Test
    void testAddress_CreateAndGet() throws Exception {
        User customer = createTestUser("Emily", "emily@cust.com", "CUSTOMER");
        String token = createBearerToken(customer);

        AddressRequest req = new AddressRequest();
        req.setLabel("Home");
        req.setAddressLine1("12 Rose Villa");
        req.setCity("Chennai");
        req.setState("Tamil Nadu");
        req.setPincode("600001");
        req.setIsDefault(true);

        // Happy path
        mockMvc.perform(post("/api/addresses")
                        .header("Authorization", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.label").value("Home"));

        // Failure path: access without token
        mockMvc.perform(get("/api/addresses/me"))
                .andExpect(status().isForbidden());
    }

    // ==========================================
    // 7. BOOKING MODULE
    // ==========================================

    @Test
    void testBooking_CreateAcceptAndInvalidTransition() throws Exception {
        User providerUser = createTestUser("Peter", "peter@prov.com", "PROVIDER");
        Provider provider = new Provider();
        provider.setUserId(providerUser.getId());
        provider = providerRepository.save(provider);

        // Setup Schedule for Wednesday 09:00 - 18:00
        Schedule schedule = new Schedule();
        schedule.setProviderId(provider.getId());
        schedule.setDayOfWeek(WeekDay.WEDNESDAY);
        schedule.setStartTime(LocalTime.of(9, 0));
        schedule.setEndTime(LocalTime.of(18, 0));
        schedule.setAvailable(true);
        scheduleRepository.save(schedule);

        // Setup Category & Service
        Category cat = new Category();
        cat.setName("Painting");
        cat.setActive(true);
        cat = categoryRepository.save(cat);

        com.Hypermarketplace.backend.model.Service svc = new com.Hypermarketplace.backend.model.Service();
        svc.setProviderId(provider.getId());
        svc.setCategoryId(cat.getId());
        svc.setTitle("Wall Painting");
        svc.setPrice(1200.0);
        svc.setActive(true);
        svc = serviceRepository.save(svc);

        // Setup Customer & Address
        User customer = createTestUser("Cathy", "cathy@cust.com", "CUSTOMER");
        Address addr = new Address();
        addr.setUserId(customer.getId());
        addr.setLabel("Home");
        addr.setAddressLine1("10 Park");
        addr.setCity("Chennai");
        addr.setState("TN");
        addr.setPincode("600001");
        addr = addressRepository.save(addr);

        // Wednesday date
        LocalDate wednesdayDate = LocalDate.of(2026, 10, 14);

        String bookingJson = """
                {
                    "serviceId": "%s",
                    "addressId": "%s",
                    "bookingDate": "2026-10-14",
                    "bookingTime": "10:00:00"
                }
                """.formatted(svc.getId(), addr.getId());

        // Happy path: create booking
        String bRes = mockMvc.perform(post("/api/bookings")
                        .header("Authorization", createBearerToken(customer))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(bookingJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.price").value(1200.0))
                .andReturn().getResponse().getContentAsString();

        BookingResponse bResp = objectMapper.readValue(bRes, BookingResponse.class);

        // Notification Check: Provider received BOOKING_CREATED notification
        assertEquals(1, notificationRepository.findByUserIdAndReadFalse(providerUser.getId()).size());

        // Failure path: Complete a PENDING booking directly (invalid state transition)
        mockMvc.perform(put("/api/bookings/" + bResp.getId() + "/complete")
                        .header("Authorization", createBearerToken(providerUser)))
                .andExpect(status().isConflict());

        // Happy path: Provider accepts booking
        mockMvc.perform(put("/api/bookings/" + bResp.getId() + "/accept")
                        .header("Authorization", createBearerToken(providerUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ACCEPTED"));

        // Happy path: Provider completes booking
        mockMvc.perform(put("/api/bookings/" + bResp.getId() + "/complete")
                        .header("Authorization", createBearerToken(providerUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }

    // ==========================================
    // 8. PAYMENT & INVOICE MODULES
    // ==========================================

    @Test
    void testPaymentAndInvoiceFlow_HappyAndDuplicateFailure() throws Exception {
        User providerUser = createTestUser("PlumberPro", "plumb@prov.com", "PROVIDER");
        Provider provider = new Provider();
        provider.setUserId(providerUser.getId());
        provider = providerRepository.save(provider);

        User customer = createTestUser("PayCust", "pay@cust.com", "CUSTOMER");

        // Create a completed booking
        Booking booking = new Booking();
        booking.setCustomerId(customer.getId());
        booking.setProviderId(provider.getId());
        booking.setPrice(1000.0);
        booking.setStatus(BookingStatusEnum.COMPLETED);
        booking = bookingRepository.save(booking);

        // Happy path: Customer initiates payment
        mockMvc.perform(post("/api/payments/initiate/" + booking.getId())
                        .header("Authorization", createBearerToken(customer)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("SUCCESS"))
                .andExpect(jsonPath("$.amount").value(1000.0))
                .andExpect(jsonPath("$.platformCommission").value(100.0))
                .andExpect(jsonPath("$.providerPayout").value(900.0));

        // Failure path: Duplicate payment attempt on already paid booking
        mockMvc.perform(post("/api/payments/initiate/" + booking.getId())
                        .header("Authorization", createBearerToken(customer)))
                .andExpect(status().isConflict());

        // Invoice Check: Invoice was auto-generated
        mockMvc.perform(get("/api/invoices/booking/" + booking.getId())
                        .header("Authorization", createBearerToken(customer)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.invoiceNumber").value(startsWith("INV-")))
                .andExpect(jsonPath("$.amount").value(1000.0));

        // Invoice Check: Owning provider can also view invoice
        mockMvc.perform(get("/api/invoices/booking/" + booking.getId())
                        .header("Authorization", createBearerToken(providerUser)))
                .andExpect(status().isOk());

        // Invoice Failure: Unrelated user cannot view invoice
        User stranger = createTestUser("Stranger", "stranger@test.com", "CUSTOMER");
        mockMvc.perform(get("/api/invoices/booking/" + booking.getId())
                        .header("Authorization", createBearerToken(stranger)))
                .andExpect(status().isNotFound());
    }

    // ==========================================
    // 9. REVIEW & RATING MODULE
    // ==========================================

    @Test
    void testReview_CompletedBookingCheckAndAggregation() throws Exception {
        User providerUser = createTestUser("RevProv", "rev@prov.com", "PROVIDER");
        Provider provider = new Provider();
        provider.setUserId(providerUser.getId());
        provider = providerRepository.save(provider);

        User customer = createTestUser("RevCust", "rev@cust.com", "CUSTOMER");

        Booking pendingBooking = new Booking();
        pendingBooking.setCustomerId(customer.getId());
        pendingBooking.setProviderId(provider.getId());
        pendingBooking.setStatus(BookingStatusEnum.PENDING);
        pendingBooking = bookingRepository.save(pendingBooking);

        ReviewRequest rReq = new ReviewRequest(pendingBooking.getId(), 5, "Great work!");

        // Failure path: Cannot review PENDING booking
        mockMvc.perform(post("/api/reviews")
                        .header("Authorization", createBearerToken(customer))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(rReq)))
                .andExpect(status().isConflict());

        // Transition booking to COMPLETED
        pendingBooking.setStatus(BookingStatusEnum.COMPLETED);
        bookingRepository.save(pendingBooking);

        // Happy path: Review completed booking
        mockMvc.perform(post("/api/reviews")
                        .header("Authorization", createBearerToken(customer))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(rReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.rating").value(5));

        // Failure path: Duplicate review for same booking
        mockMvc.perform(post("/api/reviews")
                        .header("Authorization", createBearerToken(customer))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(rReq)))
                .andExpect(status().isConflict());

        // Public rating summary aggregation check
        mockMvc.perform(get("/api/providers/" + provider.getId() + "/rating-summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.averageRating").value(5.0))
                .andExpect(jsonPath("$.totalReviews").value(1));
    }

    // ==========================================
    // 10. NOTIFICATION MODULE
    // ==========================================

    @Test
    void testNotification_ReadAndReadAll() throws Exception {
        User customer = createTestUser("NotifUser", "notif@user.com", "CUSTOMER");
        String token = createBearerToken(customer);

        Notification n1 = new Notification(customer.getId(), NotificationTypeEnum.BOOKING_CREATED, "Message 1");
        Notification n2 = new Notification(customer.getId(), NotificationTypeEnum.BOOKING_ACCEPTED, "Message 2");
        notificationRepository.save(n1);
        notificationRepository.save(n2);

        // Happy path: get notifications
        mockMvc.perform(get("/api/notifications/me")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));

        // Happy path: mark single as read
        mockMvc.perform(put("/api/notifications/" + n1.getId() + "/read")
                        .header("Authorization", token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.read").value(true));

        // Happy path: mark all as read
        mockMvc.perform(put("/api/notifications/read-all")
                        .header("Authorization", token))
                .andExpect(status().isNoContent());

        assertEquals(0, notificationRepository.findByUserIdAndReadFalse(customer.getId()).size());
    }

    // ==========================================
    // 11. ADMIN MODULE
    // ==========================================

    @Test
    void testAdminModule_AuthorizationAndAnalytics() throws Exception {
        User admin = createTestUser("SysAdmin", "sysadmin@test.com", "ADMIN");
        User customer = createTestUser("Regular", "regular@test.com", "CUSTOMER");

        Provider prov = new Provider();
        prov.setUserId(customer.getId());
        prov.setVerified(false);
        prov = providerRepository.save(prov);

        // Failure path: Customer attempting admin endpoints gets 403 Forbidden
        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", createBearerToken(customer)))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/admin/analytics/summary")
                        .header("Authorization", createBearerToken(customer)))
                .andExpect(status().isForbidden());

        // Happy path: Admin verifies provider
        mockMvc.perform(put("/api/admin/providers/" + prov.getId() + "/verify")
                        .header("Authorization", createBearerToken(admin)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.verified").value(true));

        // Happy path: Admin fetches analytics summary
        mockMvc.perform(get("/api/admin/analytics/summary")
                        .header("Authorization", createBearerToken(admin)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalUsers").value(greaterThanOrEqualTo(2)))
                .andExpect(jsonPath("$.verifiedProviders").value(1));
    }
}
